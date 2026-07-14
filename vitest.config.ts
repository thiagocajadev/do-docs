import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // The tests import through the `@/*` alias, which only tsconfig knows about.
  plugins: [tsconfigPaths()],
})
