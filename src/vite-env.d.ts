/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** opt-in error telemetry (src/modules/errorTelemetry.ts); set in .env.production */
  readonly VITE_ERROR_TELEMETRY_URL?: string
}
