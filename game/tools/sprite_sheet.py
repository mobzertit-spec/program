"""Turn generated animation sheets (one row of frames on a flat magenta background)
into clean game frames and a Godot SpriteFrames resource.

    python game/tools/sprite_sheet.py game/art/hero/frames.json

The spec file lists the sheets (paths are relative to the spec file):

    {
      "out_dir": "../../project/art/hero",     # strips, frames.tres and preview.png go here
      "res_dir": "res://art/hero",             # the same folder as Godot sees it
      "height": 240,                           # standing height of the hero in texture pixels
      "animations": [
        {"name": "idle", "file": "idle.png", "frames": 6, "fps": 8, "loop": true, "reference": true},
        {"name": "jump", "file": "jump.png", "frames": 5, "fps": 10, "loop": false, "align": "sheet"},
        {"name": "wall", "file": "wall.png", "frames": 2, "fps": 6, "loop": true, "halign": "left"}
      ]
    }

Per animation:
  align   "feet"  (default) every frame stands on the baseline
          "sheet" frames keep their height relative to each other; the lowest one touches the baseline
  halign  "torso" (default) the middle of the body sits on the centre line
          "left"  the back of the body touches the centre line (wall slide: the wall is there)
  scale   extra size factor when the generator drew this sheet a bit bigger or smaller
The "reference" sheet (normally idle) sets the size: its tallest frame becomes `height`.
Every other sheet is scaled so its body area matches the reference, which holds up
across poses far better than the bounding box does.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ALPHA_LOW, ALPHA_HIGH = 40.0, 140.0     # colour distance from the background: fully clear .. fully solid
PAD = 6                                 # empty pixels around the tallest/widest frame


def cut_background(path):
    """RGBA (float, 0..1 alpha) with the flat background keyed out and edge colours un-blended."""
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.float64)
    border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((im - bg) ** 2).sum(axis=2))
    alpha = np.clip((dist - ALPHA_LOW) / (ALPHA_HIGH - ALPHA_LOW), 0, 1)

    a = alpha[..., None]
    rgb = np.where(a > 0.02, (im - (1 - a) * bg) / np.maximum(a, 0.02), im)
    # magenta spill near the outline: red and blue both above green
    edge = ndimage.binary_dilation(alpha < 0.98, iterations=3)
    spill = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None) * edge
    rgb[..., 0] -= spill
    rgb[..., 2] -= spill
    return np.dstack([np.clip(rgb, 0, 255), alpha])


def clean_mask(alpha):
    """Solid pixels that belong to the frames: no specks, no watermark away from the row."""
    lab, n = ndimage.label(alpha > 0.5)
    if n == 0:
        raise SystemExit('nothing found on the sheet')
    areas = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
    boxes = ndimage.find_objects(lab)
    big = areas >= 0.05 * areas.max()
    band = np.zeros(alpha.shape[0], bool)
    for i in np.nonzero(big)[0]:
        band[boxes[i][0]] = True
    keep = np.zeros(n + 1, bool)
    for i in range(n):
        in_band = band[boxes[i][0]].any()
        keep[i + 1] = in_band and areas[i] >= max(30, 0.002 * areas.sum())
    solid = keep[lab]
    # the soft fringe belongs to whatever solid pixels it touches
    return solid, ndimage.binary_dilation(solid, iterations=3)


def split_frames(solid, count):
    """Column ranges of `count` frames: the empty columns between them, or equal cells as a fallback."""
    cols = solid.any(axis=0)
    xs = np.nonzero(cols)[0]
    runs, start = [], xs[0]
    for a, b in zip(xs[:-1], xs[1:]):
        if b - a > 1:
            runs.append([start, a + 1])
            start = b
    runs.append([start, xs[-1] + 1])
    while len(runs) > count:                        # loose strands: merge across the smallest gap
        gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
        i = int(np.argmin(gaps))
        runs[i:i + 2] = [[runs[i][0], runs[i + 1][1]]]
    if len(runs) == count:
        return [tuple(r) for r in runs]
    # frames touch each other: fall back to equal cells across the drawn area
    print(f'  frames touch: using {count} equal cells')
    edges = np.linspace(xs[0], xs[-1] + 1, count + 1).round().astype(int)
    return list(zip(edges[:-1], edges[1:]))


def premultiplied_resize(rgba, size):
    pre = rgba.copy()
    pre[..., :3] *= pre[..., 3:4]
    chans = [np.asarray(Image.fromarray(pre[..., c].astype(np.float32), 'F').resize(size, Image.LANCZOS))
             for c in range(4)]
    out = np.dstack(chans)
    a = np.clip(out[..., 3], 0, 1)
    out[..., :3] = np.where(a[..., None] > 0.003, out[..., :3] / np.maximum(a[..., None], 0.003), 0)
    out[..., 3] = np.where(a < 0.03, 0, a)
    return np.clip(out, 0, [255, 255, 255, 1])


def load_sheet(path, count):
    rgba = cut_background(path)
    solid, fringe = clean_mask(rgba[..., 3])
    rgba[..., 3] *= fringe
    frames = []
    for x0, x1 in split_frames(solid, count):
        cell = solid[:, x0:x1]
        ys = np.nonzero(cell.any(axis=1))[0]
        frames.append({'x0': x0, 'x1': x1, 'top': ys[0], 'bottom': ys[-1] + 1,
                       'area': float(rgba[:, x0:x1, 3].sum())})
    return rgba, frames


def body_anchor(alpha, halign):
    """x of the centre line inside a frame (same pixels as `alpha`)."""
    ys, xs = np.nonzero(alpha > 0.5)
    if halign == 'left':
        return float(np.percentile(xs, 1))
    top, bottom = ys.min(), ys.max()
    torso = (ys >= top + 0.25 * (bottom - top)) & (ys <= top + 0.6 * (bottom - top))
    return float(np.median(xs[torso]))


def build(spec_path):
    spec_path = Path(spec_path)
    spec = json.loads(spec_path.read_text(encoding='utf-8'))
    base = spec_path.parent
    out_dir = (base / spec['out_dir']).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    anims = spec['animations']

    sheets = {}
    for anim in anims:
        rgba, frames = load_sheet(base / anim['file'], anim['frames'])
        sheets[anim['name']] = (rgba, frames)
        print(f"{anim['name']}: {len(frames)} frames, heights {[f['bottom'] - f['top'] for f in frames]}")

    ref = next((a for a in anims if a.get('reference')), anims[0])
    ref_frames = sheets[ref['name']][1]
    ref_scale = spec['height'] / max(f['bottom'] - f['top'] for f in ref_frames)
    ref_area = np.median([f['area'] for f in ref_frames]) * ref_scale ** 2

    # scale every frame and place it relative to its anchor (centre line x, baseline y)
    placed = {}
    for anim in anims:
        rgba, frames = sheets[anim['name']]
        if anim is ref:
            scale = ref_scale
        else:
            scale = np.sqrt(ref_area / np.median([f['area'] for f in frames]))
        scale *= anim.get('scale', 1.0)
        sheet_bottom = max(f['bottom'] for f in frames)
        items = []
        for f in frames:
            crop = rgba[f['top']:f['bottom'], f['x0']:f['x1']]
            w, h = crop.shape[1], crop.shape[0]
            size = (max(1, round(w * scale)), max(1, round(h * scale)))
            img = premultiplied_resize(crop, size)
            ax = body_anchor(img[..., 3], anim.get('halign', 'torso'))
            lift = (sheet_bottom - f['bottom']) * scale if anim.get('align') == 'sheet' else 0.0
            # left/top of the image relative to the anchor point
            items.append((img, -ax, -size[1] - lift))
        placed[anim['name']] = items
        print(f"  {anim['name']}: scale {scale:.3f}")

    # one cell size for every animation, anchor at the bottom centre
    half_w = max(max(-l, img.shape[1] + l) for items in placed.values() for img, l, _ in items)
    up = max(-t for items in placed.values() for _, _, t in items)
    cw, ch = int(np.ceil(2 * half_w)) + 2 * PAD, int(np.ceil(up)) + 2 * PAD
    cw += cw % 2
    ox, oy = cw / 2, ch - PAD                           # anchor inside the cell

    meta = {'cell': [cw, ch], 'anchor': [ox, oy], 'height': spec['height'], 'animations': {}}
    for anim in anims:
        items = placed[anim['name']]
        strip = Image.new('RGBA', (cw * len(items), ch), (0, 0, 0, 0))
        for i, (img, left, top) in enumerate(items):
            px = Image.fromarray(np.dstack([img[..., :3], img[..., 3] * 255]).round().astype(np.uint8), 'RGBA')
            x, y = round(i * cw + ox + left), round(oy + top)
            strip.alpha_composite(px, (x, y))
        name = f"{anim['name']}.png"
        strip.save(out_dir / name)
        meta['animations'][anim['name']] = {'file': name, 'frames': len(items),
                                            'fps': anim.get('fps', 10), 'loop': anim.get('loop', True)}
    (out_dir / 'frames.json').write_text(json.dumps(meta, indent=2), encoding='utf-8')
    write_sprite_frames(out_dir / 'frames.tres', spec['res_dir'], meta)
    write_preview(out_dir, meta)
    print(f'cell {cw}x{ch}, anchor ({ox}, {oy}) -> {out_dir}')


def write_sprite_frames(path, res_dir, meta):
    cw, ch = meta['cell']
    ext, subs, anims = [], [], []
    for i, (name, a) in enumerate(meta['animations'].items(), start=1):
        ext.append(f'[ext_resource type="Texture2D" path="{res_dir}/{a["file"]}" id="{i}"]')
        frames = []
        for f in range(a['frames']):
            sid = f'AtlasTexture_{name}_{f}'
            subs.append(f'[sub_resource type="AtlasTexture" id="{sid}"]\n'
                        f'atlas = ExtResource("{i}")\nregion = Rect2({f * cw}, 0, {cw}, {ch})\n')
            frames.append(f'{{\n"duration": 1.0,\n"texture": SubResource("{sid}")\n}}')
        anims.append(f'{{\n"frames": [{", ".join(frames)}],\n"loop": {str(a["loop"]).lower()},\n'
                     f'"name": &"{name}",\n"speed": {float(a["fps"])}\n}}')
    text = '[gd_resource type="SpriteFrames" format=3]\n\n' + '\n'.join(ext) + '\n\n' + '\n'.join(subs)
    text += f'\n[resource]\nanimations = [{", ".join(anims)}]\n'
    path.write_text(text, encoding='utf-8')


def write_preview(out_dir, meta):
    """All animations on grey, one row each, with the baseline and centre line drawn in."""
    cw, ch = meta['cell']
    ox, oy = meta['anchor']
    rows = list(meta['animations'].values())
    width = cw * max(a['frames'] for a in rows)
    sheet = Image.new('RGBA', (width, ch * len(rows)), (120, 124, 132, 255))
    px = sheet.load()
    for r, a in enumerate(rows):
        strip = Image.open(out_dir / a['file'])
        sheet.alpha_composite(strip, (0, r * ch))
        for x in range(width):
            px[x, r * ch + int(oy)] = (255, 80, 80, 255)
        for f in range(a['frames']):
            for y in range(r * ch, (r + 1) * ch, 3):
                px[int(f * cw + ox), y] = (80, 200, 255, 255)
    sheet.save(out_dir / 'preview.png')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    build(sys.argv[1])
