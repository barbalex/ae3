import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import { App } from './App.jsx'

// https://vite-plugin-pwa.netlify.app/guide/prompt-for-update.html#runtime
registerSW({ immediate: true })

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
