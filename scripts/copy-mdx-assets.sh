#!/bin/sh
#
# Copy images/SVGs from $MDX (source docs folder) into public/$MDX_BASEURL/,
# mirroring the relative path layout. This makes <img src="..."> resolved by
# rehypeImg point at real files served by Next.js.
#
# Required env:
#   MDX          absolute path to the docs folder (where .md/.mdx live)
#   MDX_BASEURL  URL prefix used by the docs build (e.g. /docs)

set -e

if [ -z "$MDX" ] || [ -z "$MDX_BASEURL" ]; then
  echo "copy-mdx-assets: MDX and MDX_BASEURL must be set, skipping"
  exit 0
fi

if [ ! -d "$MDX" ]; then
  echo "copy-mdx-assets: \$MDX ($MDX) is not a directory, skipping"
  exit 0
fi

# Strip leading slash from MDX_BASEURL for the destination path
DEST_PREFIX=$(echo "$MDX_BASEURL" | sed 's|^/||')
DEST_DIR="public/$DEST_PREFIX"

echo "Copying MDX assets from $MDX → $DEST_DIR"

mkdir -p "$DEST_DIR"

# Find images/SVGs and copy preserving directory structure.
# Patterns: png jpg jpeg gif webp avif svg ico
COUNT=0
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
  COUNT=$((COUNT + 1))
done

echo "✓ MDX assets copied"
