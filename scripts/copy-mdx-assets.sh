#!/bin/sh
#
# Copy images/SVGs into public/ so the Next.js static export serves them.
#
# Two sources are mirrored:
#   1. $MDX/**          (images inside the docs folder)        → public/<rel>
#   2. $MDX/../assets/  (sibling "assets" folder, optional)    → public/assets/
#
# Image src in MDX is rewritten by rehypeImg into an absolute path under
# BASE_PATH (see resolveMdxUrl), so files must live at the matching location
# inside public/.
#
# Required env:
#   MDX  absolute or relative path to the docs folder

set -e

if [ -z "$MDX" ]; then
  echo "copy-mdx-assets: MDX must be set, skipping"
  exit 0
fi

if [ ! -d "$MDX" ]; then
  echo "copy-mdx-assets: \$MDX ($MDX) is not a directory, skipping"
  exit 0
fi

DEST_DIR="public"
mkdir -p "$DEST_DIR"

echo "Copying MDX assets from $MDX → $DEST_DIR"

find "$MDX" -type f \( \
    -iname '*.png' -o \
    -iname '*.jpg' -o \
    -iname '*.jpeg' -o \
    -iname '*.gif' -o \
    -iname '*.webp' -o \
    -iname '*.avif' -o \
    -iname '*.svg' -o \
    -iname '*.ico' \
  \) | while read -r SRC; do
  REL=${SRC#"$MDX"/}
  DEST="$DEST_DIR/$REL"
  mkdir -p "$(dirname "$DEST")"
  cp "$SRC" "$DEST"
done

SIBLING_ASSETS="$(dirname "$MDX")/assets"
if [ -d "$SIBLING_ASSETS" ]; then
  echo "Copying sibling assets from $SIBLING_ASSETS → $DEST_DIR/assets"
  find "$SIBLING_ASSETS" -type f \( \
      -iname '*.png' -o \
      -iname '*.jpg' -o \
      -iname '*.jpeg' -o \
      -iname '*.gif' -o \
      -iname '*.webp' -o \
      -iname '*.avif' -o \
      -iname '*.svg' -o \
      -iname '*.ico' \
    \) | while read -r SRC; do
    REL=${SRC#"$SIBLING_ASSETS"/}
    DEST="$DEST_DIR/assets/$REL"
    mkdir -p "$(dirname "$DEST")"
    cp "$SRC" "$DEST"
  done
fi

echo "✓ MDX assets copied"
