import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// deliberately separate from vite.config.js:
// tests need neither the PWA build nor svgr/babel react-compiler,
// only jsx with emotion as the jsx runtime (same as the app)
export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
})
