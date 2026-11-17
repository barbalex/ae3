import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import { App } from './App'
import { installErrorTelemetry } from './modules/errorTelemetry'
import { installPreloadErrorReload } from './modules/preloadErrorReload'

// https://vite-plugin-pwa.netlify.app/guide/prompt-for-update.html#runtime
registerSW({ immediate: true })
// no-op unless VITE_ERROR_TELEMETRY_URL was set at build time (.env.production)
installErrorTelemetry()
// reload once when a deploy evicted the chunks the running bundle references
installPreloadErrorReload()

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
