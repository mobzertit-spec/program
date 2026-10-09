#!/usr/bin/env bash
# One-time setup for the frame-interpolation skill: a Python venv with
# TensorFlow, plus the pretrained FILM model. Everything lives in $FILM_HOME
# (default ~/.cache/frame-interpolation), outside the project.
set -euo pipefail

FILM_HOME="${FILM_HOME:-$HOME/.cache/frame-interpolation}"
MODEL_DIR="${FILM_MODEL:-$FILM_HOME/model}"
# Public FILM SavedModel (formerly tfhub.dev/google/film/1).
MODEL_URL="${FILM_MODEL_URL:-https://www.kaggle.com/api/v1/models/google/film/tensorFlow2/film/1/download}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$FILM_HOME"

if [ ! -x "$FILM_HOME/venv/bin/python" ]; then
  echo "Creating venv in $FILM_HOME/venv"
  python3 -m venv "$FILM_HOME/venv"
fi
"$FILM_HOME/venv/bin/python" -m pip install --quiet --upgrade pip
"$FILM_HOME/venv/bin/python" -m pip install --quiet -r "$SCRIPT_DIR/requirements.txt"

if [ -f "$MODEL_DIR/saved_model.pb" ]; then
  echo "Model already present in $MODEL_DIR"
else
  echo "Downloading FILM model to $MODEL_DIR"
  archive="$FILM_HOME/film-model.tar.gz"
  if ! curl -fL --retry 3 -o "$archive" "$MODEL_URL"; then
    rm -f "$archive"
    cat >&2 <<EOF
Model download failed. Download the SavedModel manually from
  https://www.kaggle.com/models/google/film
or the authors' Google Drive (L1 / VGG / Style variants):
  https://drive.google.com/drive/folders/1q8110-qp225asX3DQvZnfLfJPkCHmDpy
and put the folder that contains saved_model.pb at $MODEL_DIR
(or pass --model <that folder> to interpolate.py).
EOF
    exit 1
  fi
  mkdir -p "$MODEL_DIR"
  tar -xf "$archive" -C "$MODEL_DIR"
  rm -f "$archive"
  if [ ! -f "$MODEL_DIR/saved_model.pb" ]; then
    echo "Archive did not contain saved_model.pb at its root; check $MODEL_DIR" >&2
    exit 1
  fi
fi

command -v ffmpeg >/dev/null || echo "Note: ffmpeg not found — .mp4/.webm output needs it (.gif works without)."
echo "Ready. Run: $FILM_HOME/venv/bin/python $SCRIPT_DIR/interpolate.py --help"
