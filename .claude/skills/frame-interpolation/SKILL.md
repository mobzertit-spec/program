---
name: frame-interpolation
description: Generate smooth in-between frames, slow-motion clips, GIFs and animated loops from two or more still images with Google Research's FILM model (Frame Interpolation for Large Motion). Use when the user wants to interpolate frames, animate between keyframes or near-duplicate photos, morph between two poses (e.g. a mascot), turn photos into a slow-motion video, or raise a clip's frame rate.
---

# Frame interpolation (FILM)

[FILM](https://github.com/google-research/frame-interpolation) (ECCV 2022, Google Research) is a neural network that
predicts the frame *between* two images, even when things move a lot between them. Applied recursively it turns
two stills into a smooth slow-motion sequence. This skill wraps the official pretrained TF2 model in one CLI:
`scripts/interpolate.py` (inference code adapted from the upstream repo, Apache-2.0 — see `LICENSE`).

## Script paths

`scripts/…` paths below are relative to the directory that contains this SKILL.md. Build the full path from that
directory (Claude Code reports it as the skill's base directory) and keep the working directory at the project root.

## One-time setup

```bash
bash scripts/setup.sh
```

It creates a venv with TensorFlow in `$FILM_HOME` (default `~/.cache/frame-interpolation`) and downloads the
pretrained model to `$FILM_HOME/model`. Nothing large is written into the project. Re-running is safe.

If the download fails (offline, blocked host), get the SavedModel by hand and point the skill at it:

- Kaggle: https://www.kaggle.com/models/google/film (same model as the old `tfhub.dev/google/film/1`)
- Authors' Google Drive, with three variants:
  https://drive.google.com/drive/folders/1q8110-qp225asX3DQvZnfLfJPkCHmDpy —
  `film_net/Style/saved_model` (sharpest, best default), `film_net/L1/saved_model` (best PSNR, slightly softer),
  `film_net/VGG/saved_model`.

Then pass `--model <folder containing saved_model.pb>` or set `FILM_MODEL` to that folder.

Run every command below with the venv's Python: `PY=~/.cache/frame-interpolation/venv/bin/python`.

## Usage

**One middle frame** (t = 0.5) between two images:

```bash
$PY scripts/interpolate.py a.png b.png --mid out/middle.png
```

**A smooth sequence + video** (`.mp4`, `.webm` or `.gif`):

```bash
$PY scripts/interpolate.py a.png b.png --times 5 --out out/frames --video out/clip.mp4 --fps 30
```

**Several keyframes** — pass them in order, or pass one directory (sorted naturally: `2.png` before `10.png`):

```bash
$PY scripts/interpolate.py keyframes/ --times 4 --video out/anim.gif --fps 24
```

**A seamless loop** — repeat the first image at the end: `a.png b.png c.png a.png`, then drop the last frame
if the player loops on its own (the last frame equals the first).

**High-resolution input** (4K, or out-of-memory errors) — tile it with `--block ROWS COLS`; the tile counts must
divide the height and width evenly (e.g. `--block 2 2` for 3840×2160). Tiles are interpolated independently, so
fast motion across a tile edge can leave a seam; use the fewest tiles that fit in memory.

**Double a video's frame rate** (audio is not kept):

```bash
mkdir -p out/src && ffmpeg -i in.mp4 out/src/%05d.png
$PY scripts/interpolate.py out/src --times 1 --out out/dbl --video out/smooth.mp4 --fps <2 × original fps>
```

### Frame count

Each neighbouring pair is split `--times` times, so K inputs give **(K − 1) × 2^times + 1** frames, inputs included
(2 inputs: `--times 3` → 9, `--times 5` → 33, `--times 7` → 129). Pick `--times` from the clip length you want:
frames ÷ fps = seconds. With `--video` and no `--out`, frames go to `<video name>_frames/` next to the video.
Existing `frame_*.png` files in the output directory are replaced.

## Preparing inputs

- All inputs must be **the same size** — the script stops otherwise. Resize or crop first.
- FILM works in **RGB only; transparency is dropped** (transparent areas usually turn black). For a transparent
  mascot or sticker, place it on a solid background first, or interpolate on a chroma colour and key it out after.
- Best results come from **related images**: burst photos, two poses of the same character, consecutive video frames.
  Unrelated images produce a ghostly cross-fade, not a morph.
- Large motion is fine (that is what FILM is built for), but very large jumps or things appearing from nowhere
  can smear. Add an intermediate keyframe when that happens.

## Performance

TensorFlow uses a GPU automatically when one is available; on CPU expect seconds per frame, more for large images.
Try `--times 2` on a small crop first, then scale up. Model inference pads each side to a multiple of 64
(`--align`) and crops back, so any size works.

## Troubleshooting

| Problem | Fix |
|---|---|
| `no FILM model at …` | Run `scripts/setup.sh`, or pass `--model`/set `FILM_MODEL`. |
| `input images differ in size` | Resize/crop every input to one size. |
| `ffmpeg not found` | Install ffmpeg, or write a `.gif` instead. |
| Out of memory | Use `--block 2 2` (or more), or downscale the inputs. |
| No TensorFlow wheel for this Python | Recreate the venv with a Python version TensorFlow supports. |

## Credits

FILM: Frame Interpolation for Large Motion — Fitsum Reda, Janne Kontkanen, Eric Tabellion, Deqing Sun,
Caroline Pantofaru, Brian Curless. ECCV 2022. https://film-net.github.io/ · https://arxiv.org/abs/2202.04901
