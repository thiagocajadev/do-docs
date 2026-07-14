import { readFileSync } from 'node:fs'

const basePath = process.env.BASE_PATH || ''
const distDir = process.env.DIST_DIR || undefined
const output = process.env.OUTPUT || undefined
const staticPageGenerationTimeout = Number(process.env.STATIC_PAGE_GENERATION_TIMEOUT) || 60

// Stamped into the footer, so a published site says which DoDocs generated it.
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  staticPageGenerationTimeout,
  // Not NEXT_PUBLIC_*: those are inlined from the real shell environment, where this is unset, and
  // that empty value would win over the one below. The footer is a server component anyway.
  env: {
    DODOCS_VERSION: version,
  },
  images: {
    // domains: ['codesandbox.io'],
    unoptimized: true,
  },
  basePath,
  distDir,
  output,
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docs/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
    ]
  },
}
// console.log('nextConfig=', nextConfig)

export default nextConfig
