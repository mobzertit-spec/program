#!/usr/bin/env python3
# Adapted from google-research/frame-interpolation (eval/interpolator.py and
# eval/util.py), Copyright 2022 Google LLC, Apache License 2.0 — see ../LICENSE.
"""Generates in-between frames with FILM (Frame Interpolation for Large Motion).

Each neighbouring pair of input images is interpolated by recursive midpoint
splitting, so 2 inputs and --times N give 2^N + 1 frames; K inputs give
(K - 1) * 2^N + 1 frames. Frames are written as PNGs and can also be encoded
to a video or GIF.

Examples:
  interpolate.py a.png b.png --mid middle.png
  interpolate.py a.png b.png --times 5 --out frames/ --video clip.mp4
  interpolate.py keyframes/ --times 3 --out frames/ --video loop.gif --fps 24
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')

FILM_HOME = Path(os.environ.get('FILM_HOME',
                                Path.home() / '.cache' / 'frame-interpolation'))
DEFAULT_MODEL = Path(os.environ.get('FILM_MODEL', FILM_HOME / 'model'))
IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp'}


def natural_key(path):
  return [int(s) if s.isdigit() else s.lower()
          for s in re.split(r'(\d+)', path.name)]


def collect_inputs(inputs):
  """Expands a single directory argument into its images, in natural order."""
  if len(inputs) == 1 and inputs[0].is_dir():
    files = sorted((p for p in inputs[0].iterdir()
                    if p.suffix.lower() in IMAGE_EXTS), key=natural_key)
  else:
    files = inputs
  if len(files) < 2:
    sys.exit('error: need at least two input images.')
  for f in files:
    if not f.is_file():
      sys.exit(f'error: no such image: {f}')
  return files


def read_image(path):
  """Reads an image as float32 RGB in [0, 1]. Alpha is dropped."""
  with Image.open(path) as im:
    return np.asarray(im.convert('RGB'), dtype=np.float32) / 255.0


def write_image(path, image):
  pixels = (np.clip(image, 0.0, 1.0) * 255.0 + 0.5).astype(np.uint8)
  Image.fromarray(pixels).save(path)


def pad_to_align(x, align):
  """Zero-pads a (B, H, W, C) batch so H and W divide by `align`."""
  height, width = x.shape[1:3]
  pad_h = -height % align
  pad_w = -width % align
  top, left = pad_h // 2, pad_w // 2
  padded = np.pad(x, ((0, 0), (top, pad_h - top), (left, pad_w - left),
                      (0, 0)))
  return padded, (top, left, height, width)


def to_patches(x, block_h, block_w):
  """Splits a (1, H, W, C) image into (block_h * block_w, H/bh, W/bw, C)."""
  _, height, width, channels = x.shape
  ph, pw = height // block_h, width // block_w
  return (x[0].reshape(block_h, ph, block_w, pw, channels)
          .transpose(0, 2, 1, 3, 4).reshape(block_h * block_w, ph, pw,
                                             channels))


def from_patches(patches, block_h, block_w):
  _, ph, pw, channels = patches.shape
  return (patches.reshape(block_h, block_w, ph, pw, channels)
          .transpose(0, 2, 1, 3, 4).reshape(1, block_h * ph, block_w * pw,
                                             channels))


class Interpolator:
  """Wraps a FILM TF2 SavedModel (inputs x0, x1, time -> outputs image)."""

  def __init__(self, model_path, align=64, block=(1, 1)):
    import tensorflow as tf  # Imported late so --help stays fast.
    self._tf = tf
    self._model = tf.saved_model.load(str(model_path))
    self._align = align
    self._block = block

  def _run(self, x0, x1, dt):
    if self._align > 1:
      x0, (top, left, height, width) = pad_to_align(x0, self._align)
      x1, _ = pad_to_align(x1, self._align)
    inputs = {'x0': self._tf.constant(x0), 'x1': self._tf.constant(x1),
              'time': self._tf.constant(dt[..., np.newaxis])}
    try:
      result = self._model(inputs, training=False)
    except (TypeError, ValueError):
      # Models exported without a Keras `training` argument (e.g. TF Hub).
      result = self._model(inputs)
    image = result['image'].numpy()
    if self._align > 1:
      image = image[:, top:top + height, left:left + width]
    return image

  def __call__(self, x0, x1, dt):
    block_h, block_w = self._block
    if block_h * block_w == 1:
      return self._run(x0, x1, dt)
    # Interpolate high-resolution inputs tile by tile to bound memory.
    tiles = [self._run(a[np.newaxis], b[np.newaxis], dt)
             for a, b in zip(to_patches(x0, block_h, block_w),
                             to_patches(x1, block_h, block_w))]
    return from_patches(np.concatenate(tiles), block_h, block_w)

  def midpoint(self, frame0, frame1):
    dt = np.full((1,), 0.5, dtype=np.float32)
    return self(frame0[np.newaxis], frame1[np.newaxis], dt)[0]


def recursive_frames(interp, frame0, frame1, depth):
  """Yields frame0 and the in-betweens up to (excluding) frame1."""
  if depth == 0:
    yield frame0
    return
  mid = interp.midpoint(frame0, frame1)
  yield from recursive_frames(interp, frame0, mid, depth - 1)
  yield from recursive_frames(interp, mid, frame1, depth - 1)


def encode(frames_dir, video, fps):
  frames = sorted(frames_dir.glob('frame_*.png'))
  if video.suffix.lower() == '.gif':
    images = [Image.open(f) for f in frames]
    images[0].save(video, save_all=True, append_images=images[1:],
                   duration=round(1000 / fps), loop=0, disposal=2)
    return
  ffmpeg = shutil.which('ffmpeg')
  if not ffmpeg:
    sys.exit('error: ffmpeg not found; install it or use a .gif output.')
  codec = {'.webm': ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30']}.get(
      video.suffix.lower(), ['-c:v', 'libx264', '-crf', '18'])
  subprocess.run(
      [ffmpeg, '-y', '-loglevel', 'error', '-framerate', str(fps),
       '-i', str(frames_dir / 'frame_%05d.png'),
       # Even dimensions are required by yuv420p.
       '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2', '-pix_fmt', 'yuv420p',
       *codec, str(video)], check=True)


def main():
  parser = argparse.ArgumentParser(
      description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
  parser.add_argument('inputs', nargs='+', type=Path,
                      help='two or more images in order, or one directory')
  parser.add_argument('--model', type=Path, default=DEFAULT_MODEL,
                      help='FILM SavedModel directory (default: %(default)s)')
  parser.add_argument('--times', type=int, default=3,
                      help='recursive midpoint passes per pair (default: 3)')
  parser.add_argument('--mid', type=Path,
                      help='write only the t=0.5 frame of two inputs here')
  parser.add_argument('--out', type=Path,
                      help='directory for frame_00000.png, frame_00001.png …')
  parser.add_argument('--video', type=Path,
                      help='also encode the frames to .mp4, .webm or .gif')
  parser.add_argument('--fps', type=float, default=30)
  parser.add_argument('--align', type=int, default=64,
                      help='pad sides to a multiple of this (default: 64)')
  parser.add_argument('--block', type=int, nargs=2, default=(1, 1),
                      metavar=('ROWS', 'COLS'),
                      help='tile high-res inputs; must divide height/width')
  args = parser.parse_args()

  files = collect_inputs(args.inputs)
  if args.mid and len(files) != 2:
    sys.exit('error: --mid takes exactly two input images.')
  if not args.mid and not (args.out or args.video):
    sys.exit('error: pass --mid, --out or --video.')
  if args.times < 1:
    sys.exit('error: --times must be at least 1.')
  if not (args.model / 'saved_model.pb').is_file():
    sys.exit(f'error: no FILM model at {args.model}. Run scripts/setup.sh '
             'or pass --model <dir containing saved_model.pb>.')

  sizes = set()
  for f in files:
    with Image.open(f) as im:
      sizes.add(im.size)
  if len(sizes) > 1:
    sys.exit(f'error: input images differ in size {sorted(sizes)}; '
             'resize or crop them to one size first.')
  width, height = sizes.pop()
  rows, cols = args.block
  if height % rows or width % cols:
    sys.exit(f'error: --block {rows} {cols} must evenly divide '
             f'{width}x{height}.')

  interp = Interpolator(args.model, args.align, (rows, cols))

  if args.mid:
    args.mid.parent.mkdir(parents=True, exist_ok=True)
    write_image(args.mid, interp.midpoint(read_image(files[0]),
                                          read_image(files[1])))
    print(f'wrote {args.mid}')
    return

  out_dir = args.out or args.video.with_name(args.video.stem + '_frames')
  out_dir.mkdir(parents=True, exist_ok=True)
  for old in out_dir.glob('frame_*.png'):
    old.unlink()

  total = (len(files) - 1) * 2**args.times + 1
  index = 0

  def save(frame):
    nonlocal index
    write_image(out_dir / f'frame_{index:05d}.png', frame)
    index += 1
    print(f'\rframe {index}/{total}', end='', file=sys.stderr, flush=True)

  current = read_image(files[0])
  for path in files[1:]:
    nxt = read_image(path)
    for frame in recursive_frames(interp, current, nxt, args.times):
      save(frame)
    current = nxt
  save(current)
  print(file=sys.stderr)
  print(f'wrote {index} frames to {out_dir}')

  if args.video:
    args.video.parent.mkdir(parents=True, exist_ok=True)
    encode(out_dir, args.video, args.fps)
    print(f'wrote {args.video}')


if __name__ == '__main__':
  main()
