"""Turn generated animation sheets into clean game frames and a Godot SpriteFrames resource.

    python game/tools/sprite_sheet.py game/art/hero/frames.json

Sheets can be a row of frames on a flat background (magenta, grey...), several rows of
frames, or a transparent grid like the ones Higgsfield AutoSprite exports. The spec
file lists the animations; paths are relative to the spec file:

    {
      "out_dir": "../../project/art/hero",   # strips and frames.tres go here (preview.png next to the spec)
      "res_dir": "res://art/hero",           # the same folder as Godot sees it
      "height": 240,                         # standing height of the hero in texture pixels
      "sheets": {                            # optional: sheets that several animations pick from
        "first": {"file": "source/first_try_sheet.png", "remove_lines": true}
      },
      "animations": [
        {"name": "idle", "file": "idle.png", "frames": 6, "fps": 8, "reference": true},
        {"name": "walk", "sheet": "first", "pick": [[0, 1], [0, 2], [1, 3]], "fps": 10},
        {"name": "run", "file": "run.png", "grid": [5, 5], "every": 2, "fps": 16},
        {"name": "wall", "file": "wall.png", "frames": 2, "halign": "left"}
      ]
    }

Where the frames come from:
  file + frames   one row with that many frames
  file + grid     [columns, rows] of equal cells (AutoSprite)
  file alone      rows and frames found from the empty space between them
  sheet           a named entry of "sheets" (same keys as above, plus remove_lines)
  pick            frames to use, in order: numbers in reading order, or [row, column]
  start, every, count   a slice of the frames instead of pick (every 2nd frame...)
  remove_lines    erase long straight guide lines (a drawn ground or wall)
  flip            mirror the frames (the hero must face right)
  breathe         make that many idle frames from the first chosen frame: the upper body
                  rises and settles a little (a stand-in until a drawn idle exists)

How each frame is placed:
  align   "feet"  (default) every frame stands on the baseline
          "sheet" frames keep their height relative to the ground of their row or cell;
                  the lowest one touches the baseline (jumps)
  halign  "torso" (default) the middle of the body sits on the centre line
          "head"  the middle of the head sits on the centre line (steadiest for walk and run)
          "left"  the back of the body touches the centre line (wall slide: the wall is there)
  scale   extra size factor when the generator drew this sheet a bit bigger or smaller
The "reference" animation (normally idle) sets the size: its tallest frame becomes `height`.
Every other animation is scaled so the head is as big as in the reference: the head keeps
its size whatever the pose, unlike the height or the area of the whole body.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ALPHA_LOW, ALPHA_HIGH = 40.0, 140.0     # colour distance from the background: fully clear .. fully solid
PAD = 6                                 # empty pixels around the tallest/widest frame


# ---------- reading a sheet ----------

def read_rgba(path, flip=False):
    """RGBA as floats (colour 0..255, alpha 0..1). A flat background is keyed out."""
    img = Image.open(path)
    if flip:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    if img.mode in ('RGBA', 'LA', 'PA') or 'transparency' in img.info:
        arr = np.asarray(img.convert('RGBA')).astype(np.float64)
        if arr[..., 3].min() < 250:
            return np.dstack([arr[..., :3], arr[..., 3] / 255.0])
    return key_background(np.asarray(img.convert('RGB')).astype(np.float64))


def key_background(im):
    border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((im - bg) ** 2).sum(axis=2))
    if bg[1] < min(bg[0], bg[2]) - 60:
        # magenta/pink: how magenta a pixel is (red and blue above green) is how much background
        # it holds, so ink mixed with background in small gaps (shoelaces, between the legs) clears too
        pink = np.minimum(im[..., 0], im[..., 2]) - im[..., 1]
        share = np.clip(pink / (min(bg[0], bg[2]) - bg[1]), 0, 1)
        alpha = np.clip((0.9 - share) / 0.8, 0, 1)
    else:
        # Only pixels right next to the background get a soft edge; everything else is solid.
        # Light skin on a light grey sheet is close to the paper colour, and a soft key over the
        # whole picture would make it see-through.
        background = dist < 18
        fringe = ndimage.binary_dilation(background, iterations=2) & ~background
        alpha = np.ones_like(dist)
        alpha[background] = 0
        alpha[fringe] = np.clip((dist[fringe] - ALPHA_LOW) / (ALPHA_HIGH - ALPHA_LOW), 0, 1)
    a = alpha[..., None]
    rgb = np.where(a > 0.02, (im - (1 - a) * bg) / np.maximum(a, 0.02), im)
    # background spill near the outline: pull edge colours away from the background hue
    edge = ndimage.binary_dilation(alpha < 0.98, iterations=3)
    if bg[1] < min(bg[0], bg[2]):           # magenta/pink: red and blue both above green
        spill = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None) * edge
        rgb[..., 0] -= spill
        rgb[..., 2] -= spill
    return np.dstack([np.clip(rgb, 0, 255), alpha])


def remove_guide_lines(rgba, min_run=200):
    """Erase drawn ground lines (rows of ink across the sheet) and wall lines (long straight
    columns of ink). Ink that a figure sits on (something solid right above/below or beside it)
    stays, so shoe soles and backs leaning on the wall keep their outline."""
    alpha = rgba[..., 3]
    ink = (alpha > 0.5) & (rgba[..., :3].mean(axis=2) < 90)
    solid = alpha > 0.5
    H, W = ink.shape
    out = alpha.copy()

    for y0, y1 in runs(ink.sum(axis=1) > 0.5 * W):
        above, below = solid[max(0, y0 - 4)], solid[min(H - 1, y1 + 3)]
        clear = ~(above | below)
        out[max(0, y0 - 1):min(H, y1 + 1), clear] = 0

    # vertical lines: long ink runs in neighbouring columns, grouped into one line each
    segs = [(x, y0, y1) for x in range(W) for y0, y1 in runs(ink[:, x]) if y1 - y0 >= min_run]
    lines = []
    for x, y0, y1 in segs:
        for line in lines:
            if x - line[1] <= 6 and y0 < line[3] and y1 > line[2]:   # double strokes count as one wall
                line[1], line[2], line[3] = x, min(line[2], y0), max(line[3], y1)
                break
        else:
            lines.append([x, x, y0, y1])
    for x0, x1, y0, y1 in lines:
        # look past the line's soft edge on both sides
        left = solid[y0:y1, max(0, x0 - 4)]
        right = solid[y0:y1, min(W - 1, x1 + 4)]
        keep = left | right                     # where a figure leans on the line, it is the figure's outline
        out[y0:y1, max(0, x0 - 2):min(W, x1 + 3)][~keep] = 0
    rgba[..., 3] = out
    return rgba


def runs(flags, min_gap=1):
    """[start, stop) ranges where `flags` is true; gaps shorter than `min_gap` are bridged."""
    idx = np.nonzero(flags)[0]
    if not len(idx):
        return []
    out, start, prev = [], idx[0], idx[0]
    for i in idx[1:]:
        if i - prev > min_gap:
            out.append((start, prev + 1))
            start = i
        prev = i
    out.append((start, prev + 1))
    return out


def solid_components(alpha):
    """Labels of the solid pieces that belong to frames: no specks, no watermark off the rows."""
    lab, n = ndimage.label(alpha > 0.5)
    if n == 0:
        raise SystemExit('nothing found on the sheet')
    areas = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
    boxes = ndimage.find_objects(lab)
    big = areas >= 0.05 * areas.max()
    band = np.zeros(alpha.shape[0], bool)
    for i in np.nonzero(big)[0]:
        band[boxes[i][0]] = True
    keep = [i + 1 for i in range(n)
            if band[boxes[i][0]].any() and areas[i] >= max(30, 0.0015 * areas.sum())]
    return lab, keep, boxes


def frame_boxes(solid, count=None, grid=None):
    """(y0, y1, x0, x1, row, col) of every frame, in reading order."""
    H, W = solid.shape
    if grid:
        cols, rows = grid
        ys = np.linspace(0, H, rows + 1).round().astype(int)
        xs = np.linspace(0, W, cols + 1).round().astype(int)
        return [(ys[r], ys[r + 1], xs[c], xs[c + 1], r, c) for r in range(rows) for c in range(cols)]
    boxes = []
    bands = runs(solid.any(axis=1), min_gap=8)
    for r, (y0, y1) in enumerate(bands):
        cells = [list(c) for c in runs(solid[y0:y1].any(axis=0), min_gap=6)]
        if count and len(bands) == 1:
            while len(cells) > count:              # loose strands: merge across the smallest gap
                gaps = [cells[i + 1][0] - cells[i][1] for i in range(len(cells) - 1)]
                i = int(np.argmin(gaps))
                cells[i:i + 2] = [[cells[i][0], cells[i + 1][1]]]
            if len(cells) < count:                 # frames touch: equal cells across the drawn area
                print(f'  frames touch: using {count} equal cells')
                edges = np.linspace(cells[0][0], cells[-1][1], count + 1).round().astype(int)
                cells = [[a, b] for a, b in zip(edges[:-1], edges[1:])]
        boxes += [(y0, y1, x0, x1, r, c) for c, (x0, x1) in enumerate(cells)]
    return boxes


def load_sheet(path, opts):
    rgba = read_rgba(path, opts.get('flip', False))
    if opts.get('remove_lines'):
        rgba = remove_guide_lines(rgba)
    lab, keep, comp_boxes = solid_components(rgba[..., 3])
    solid = np.isin(lab, keep)
    boxes = frame_boxes(solid, opts.get('frames'), opts.get('grid'))

    # every solid piece belongs to the frame box that holds its centre
    owner = {}
    for k in keep:
        sl = comp_boxes[k - 1]
        cy, cx = (sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2
        for i, (y0, y1, x0, x1, _, _) in enumerate(boxes):
            if y0 <= cy < y1 and x0 <= cx < x1:
                owner.setdefault(i, []).append(k)
                break
    frames = []
    for i, (y0, y1, x0, x1, r, c) in enumerate(boxes):
        if i not in owner:
            continue                                # empty grid cell
        mask = np.isin(lab, owner[i])
        ys, xs = np.nonzero(mask)
        top, bottom, left, right = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        top, left = max(0, top - 3), max(0, left - 3)
        bottom, right = min(mask.shape[0], bottom + 3), min(mask.shape[1], right + 3)
        soft = ndimage.binary_dilation(mask[top:bottom, left:right], iterations=3)
        crop = rgba[top:bottom, left:right].copy()
        crop[..., 3] *= soft
        frames.append({'row': r, 'col': c, 'rgba': crop, 'top': top, 'bottom': bottom,
                       'ground': y1})
    # frames found from empty space: their row's ground is the lowest foot in that row
    if not opts.get('grid'):
        for f in frames:
            f['ground'] = max(g['bottom'] for g in frames if g['row'] == f['row'])
    return frames


def choose(frames, anim):
    if 'pick' in anim:
        out = []
        for p in anim['pick']:
            if isinstance(p, int):
                out.append(frames[p])
            else:
                out.append(next(f for f in frames if (f['row'], f['col']) == tuple(p)))
        return out
    start, every = anim.get('start', 0), anim.get('every', 1)
    out = frames[start::every]
    return out[:anim['count']] if 'count' in anim else out


def breathe(frame, count, amount=0.012):
    """Idle loop from one still frame: everything above the waist stretches up and back."""
    src = frame['rgba']
    h, w = src.shape[:2]
    pre = src.copy()
    pre[..., :3] *= pre[..., 3:4]
    ys = np.nonzero((src[..., 3] > 0.5).any(axis=1))[0]
    waist = ys[0] + 0.62 * (ys[-1] - ys[0])
    room = int(np.ceil(amount * waist)) + 2
    out = []
    for i in range(count):
        e = amount * 0.5 * (1 - np.cos(2 * np.pi * i / count))
        yy, xx = np.mgrid[0:h + room, 0:w].astype(np.float64)
        yy -= room
        src_y = np.where(yy < waist, waist - (waist - yy) / (1 + e), yy)
        img = np.dstack([ndimage.map_coordinates(pre[..., c], [src_y, xx], order=1, cval=0)
                         for c in range(4)])
        a = np.clip(img[..., 3:4], 0, 1)
        img[..., :3] = np.where(a > 0.004, img[..., :3] / np.maximum(a, 0.004), 0)
        img[..., 3:4] = a
        out.append(dict(frame, rgba=img, top=frame['top'] - room))
    return out


# ---------- placing frames ----------

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


def neck_row(alpha):
    """Row of the neck: the narrowest row between 15% and 50% of the figure's height."""
    solid = alpha > 0.5
    ys = np.nonzero(solid.any(axis=1))[0]
    top, height = ys[0], ys[-1] - ys[0]
    widths = []
    for y in range(top + int(0.15 * height), top + int(0.5 * height)):
        xs = np.nonzero(solid[y])[0]
        widths.append(xs[-1] - xs[0] if len(xs) else 0)
    return top + int(0.15 * height) + int(np.argmin(widths))


def head_size(alpha):
    ys = np.nonzero((alpha > 0.5).any(axis=1))[0]
    return neck_row(alpha) - ys[0]


def body_anchor(alpha, halign):
    """x of the centre line inside a frame (same pixels as `alpha`)."""
    ys, xs = np.nonzero(alpha > 0.5)
    if halign == 'left':
        return float(np.percentile(xs, 1))
    if halign == 'head':
        return float(np.median(xs[ys < neck_row(alpha)]))
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
    sheets = spec.get('sheets', {})

    cache, chosen = {}, {}
    for anim in anims:
        opts = sheets[anim['sheet']] if 'sheet' in anim else anim
        key = json.dumps({k: opts.get(k) for k in ('file', 'frames', 'grid', 'remove_lines', 'flip')})
        if key not in cache:
            cache[key] = load_sheet(base / opts['file'], opts)
            print(f"{opts['file']}: {len(cache[key])} frames")
        chosen[anim['name']] = choose(cache[key], anim)
        if anim.get('breathe'):
            chosen[anim['name']] = breathe(chosen[anim['name']][0], anim['breathe'])
        print(f"  {anim['name']}: {len(chosen[anim['name']])} frames, "
              f"heights {[int(f['bottom'] - f['top']) for f in chosen[anim['name']]]}")

    ref = next((a for a in anims if a.get('reference')), anims[0])
    ref_frames = chosen[ref['name']]
    ref_scale = spec['height'] / max(f['bottom'] - f['top'] for f in ref_frames)
    ref_head = np.median([head_size(f['rgba'][..., 3]) for f in ref_frames]) * ref_scale

    # scale every frame and place it relative to its anchor (centre line x, baseline y)
    placed = {}
    for anim in anims:
        frames = chosen[anim['name']]
        if anim is ref:
            scale = ref_scale
        else:
            scale = ref_head / np.median([head_size(f['rgba'][..., 3]) for f in frames])
        scale *= anim.get('scale', 1.0)
        rise = [f['ground'] - f['bottom'] for f in frames]
        items = []
        for f, up in zip(frames, rise):
            h, w = f['rgba'].shape[:2]
            size = (max(1, round(w * scale)), max(1, round(h * scale)))
            img = premultiplied_resize(f['rgba'], size)
            ax = body_anchor(img[..., 3], anim.get('halign', 'torso'))
            lift = (up - min(rise)) * scale if anim.get('align') == 'sheet' else 0.0
            items.append((img, -ax, -size[1] - lift))    # left/top of the image relative to the anchor
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
            strip.alpha_composite(px, (round(i * cw + ox + left), round(oy + top)))
        name = f"{anim['name']}.png"
        strip.save(out_dir / name)
        meta['animations'][anim['name']] = {'file': name, 'frames': len(items),
                                            'fps': anim.get('fps', 10), 'loop': anim.get('loop', True)}
    write_sprite_frames(out_dir / 'frames.tres', spec['res_dir'], meta)
    write_preview(out_dir, meta, base / 'preview.png')
    print(f'cell {cw}x{ch}, anchor ({ox}, {oy}) -> {out_dir}')


# ---------- output ----------

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
    ox, oy = meta['anchor']
    text += f'\n[resource]\nanimations = [{", ".join(anims)}]\n'
    # where the feet are inside a frame, and the standing height, for player_visual.gd
    text += f'metadata/anchor = Vector2({ox}, {oy})\nmetadata/height = {float(meta["height"])}\n'
    path.write_text(text, encoding='utf-8')


def write_preview(out_dir, meta, path):
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
    sheet.save(path)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    build(sys.argv[1])
