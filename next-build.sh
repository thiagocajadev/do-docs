#!/bin/sh
#
# Next.js build wrapper.
#
# Usage:
#   OUTPUT=export npm run build  # Static export (GitHub Pages)
#   npm run build                # Server build (Vercel)

# Copy images/SVGs from $MDX into public/$MDX_BASEURL/ so they're served as static assets
sh scripts/copy-mdx-assets.sh

next build
