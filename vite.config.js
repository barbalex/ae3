import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
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
      },
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      // https://developer.mozilla.org/en-US/docs/Web/Manifest
      manifest: {
        scope: '.',
        name: 'arteigenschaften.ch',
        short_name: 'arteigenschaften',
        start_url: './',
        background_color: '#e65100',
        theme_color: '#e65100',
        display: 'minimal-ui',
        icon: 'src/images/favicon256.png',
        include_favicon: true,
        lang: 'de-CH',
        orientation: 'portrait',
        description:
          'Eigenschaften von Flora, Fauna, Moosen und Lebensräumen: Sichten, exportieren, importieren',
      },
      devOptions: {
        //enabled: true,
      },
    }),
    react(),
  ],
})
