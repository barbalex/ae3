// deploy-churn self-healing: when a deploy removes the hashed chunks the
// running bundle references, dynamic imports fail ("Unable to preload
// CSS for …" / "Failed to fetch dynamically imported module"). Vite
// dispatches vite:preloadError on window for both; one reload picks up
// the new index.html with its fresh hashes. The cooldown stops a reload
// loop when the failure has another cause (offline, blocked requests) —
// then the error propagates and errorTelemetry reports it.
const RELOAD_COOLDOWN_MS = 30_000
const LAST_RELOAD_KEY = 'ae3-preload-error-reload-at'

// undefined = sessionStorage unavailable (privacy mode): never reload,
// an unguarded reload loop is worse than a visible error
const readLastReloadAt = (): number | undefined => {
  try {
    return Number(sessionStorage.getItem(LAST_RELOAD_KEY)) || 0
  } catch {
    return undefined
  }
}

export const installPreloadErrorReload = () => {
  window.addEventListener('vite:preloadError', (event) => {
    const lastReloadAt = readLastReloadAt()
    if (lastReloadAt === undefined) return
    if (Date.now() - lastReloadAt < RELOAD_COOLDOWN_MS) return
    try {
      sessionStorage.setItem(LAST_RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    // canceled on purpose: the reload recovers from this error, so it
    // must not surface as an unhandled error in telemetry
    event.preventDefault()
    window.location.reload()
  })
}
