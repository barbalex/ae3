import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
import babel from '@rolldown/plugin-babel'

// The home hero image (home.webp) is the LCP element, but it is rendered by
// the lazy Home route chunk, so the browser only discovers it after the app
// JS has run. This injects an inline script into <head> that preloads the
// hashed asset with high priority — running during the initial HTML parse,
// before any app JS is fetched (Lighthouse: "LCP request discovery"). The
// SPA shares one index.html, so the script preloads only on the routes that
// render Home; the segment list mirrors the index routes in Router.tsx.
const preloadHomeImage = (): Plugin => ({
  name: 'preload-home-image',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (_html, ctx) => {
      const homeImage = Object.values(ctx.bundle ?? {}).find(
        (file) =>
          file.type === 'asset' && /home-[^/]+\.webp$/.test(file.fileName),
      )
      if (!homeImage) {
        throw new Error('preload-home-image: home.webp not in build output')
      }
      const href = `/${homeImage.fileName}`
      const script = String.raw`(() => {
  const homeSegments = ['Arten', 'Lebensräume', 'Eigenschaften-Sammlungen', 'Benutzer', 'Organisationen']
  const segments = decodeURIComponent(window.location.pathname).split('/').filter(Boolean)
  const isHome = segments.length === 0 || (segments.length === 1 && homeSegments.includes(segments[0]))
  if (!isHome) return
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.type = 'image/webp'
  link.setAttribute('fetchpriority', 'high')
  link.href = '${href}'
  document.head.appendChild(link)
})()`
      return [
        {
          tag: 'script',
          children: script,
          injectTo: 'head-prepend',
        },
      ]
    },
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 5174 },
  // es workers keep their dynamic imports (exceljs, xlsx) as shared
  // chunks instead of inlining them into every worker bundle
  worker: {
    format: 'es',
  },
  // cssMinify is needed due to an error in vite:
  // https://github.com/vitejs/vite/issues/21911#issuecomment-4097280874
  // TODO: remove this and uninstall esbuild when the issue is fixed
  build: {
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react-router')) {
            return 'react-router'
          }
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-error-boundary') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react-vendor'
          }
          if (
            id.includes('node_modules/jotai') ||
            id.includes('node_modules/@tanstack')
          ) {
            return 'state'
          }
        },
      },
    },
  },
  plugins: [
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    VitePWA({
      workbox: {
        sourcemap: true,
        globPatterns: [
          '**/*.{js,jsx,ts,tsx,css,html,ico,png,jpg,svg,webp,json,woff2,woff}',
        ],
        // xlsx (@e965/xlsx, ~1 MB, import worker) is lazily imported on
        // first import; don't make every first visit download it.
        // It is runtime-cached below after first use.
        // write-excel-file (export, ~71 KB) is small enough to precache
        globIgnores: ['**/xlsx-*.js'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/xlsx-[^/]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'excel-chunks',
              expiration: {
                maxEntries: 6,
                purgeOnQuotaError: true,
              },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 1000000000,
      },
      registerType: 'autoUpdate',
      includeAssets: [
        'android-chrome-192x192.png',
        'android-chrome-256x256.png',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      // https://developer.mozilla.org/en-US/docs/Web/Manifest
      manifest: {
        scope: '.',
        name: 'arteigenschaften.ch',
        short_name: 'arteigenschaften',
        start_url: './',
        background_color: '#943400',
        theme_color: '#943400',
        display: 'minimal-ui',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
        orientation: 'portrait',
        description:
          'Eigenschaften von Flora, Fauna, Moosen und Lebensräumen: Sichten, exportieren, importieren',
      },
      devOptions: {
        //enabled: true,
      },
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    preloadHomeImage(),
  ],
  css: {
    modules: {
      // enable using named exports for css classes
      // https://vite.dev/guide/features.html#css-modules
      localsConvention: 'camelCaseOnly',
    },
  },
})
