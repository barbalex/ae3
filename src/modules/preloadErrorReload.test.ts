import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { installPreloadErrorReload } from './preloadErrorReload'

// jsdom's location.reload is non-configurable, so spyOn cannot intercept
// it. Instead the tests stub window (like errorTelemetry.test.ts): the
// stub captures the registered listener and replaces only location.reload.
const reload = vi.fn()
const registered = new Map<string, EventListener>()
const stubWindow = {
  addEventListener: (type: string, cb: EventListener) =>
    registered.set(type, cb),
  location: { reload },
}

// mirrors window.dispatchEvent: false when a cancelable event was canceled
const dispatchPreloadError = () => {
  const event = new Event('vite:preloadError', { cancelable: true })
  registered.get('vite:preloadError')!(event)
  return !event.defaultPrevented
}

describe('installPreloadErrorReload', () => {
  beforeEach(() => {
    sessionStorage.clear()
    reload.mockClear()
    registered.clear()
    vi.stubGlobal('window', stubWindow)
    installPreloadErrorReload()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reloads and cancels the error on first occurrence', () => {
    expect(dispatchPreloadError()).toBe(false)
    expect(reload).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('ae3-preload-error-reload-at')).toBeTruthy()
  })

  it('does not reload again within the cooldown and lets the error through', () => {
    dispatchPreloadError()
    expect(dispatchPreloadError()).toBe(true)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('reloads again after the cooldown has passed', () => {
    dispatchPreloadError()
    sessionStorage.setItem(
      'ae3-preload-error-reload-at',
      String(Date.now() - 31_000),
    )
    expect(dispatchPreloadError()).toBe(false)
    expect(reload).toHaveBeenCalledTimes(2)
  })

  it('never reloads when sessionStorage is unavailable', () => {
    // jsdom's Storage resists vi.spyOn (the mock never engages), so swap
    // the whole global — the module reads the bare global at call time
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {},
    })
    expect(dispatchPreloadError()).toBe(true)
    expect(reload).not.toHaveBeenCalled()
  })
})
