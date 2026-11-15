import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  defaultExportConfigEncoded,
  decodeExportConfig,
  encodeExportConfig,
  exportConfigParamName,
} from '../../modules/exportConfigUrl'
import { exportConfigAtom, setExportConfigAtom } from '../../store'

/**
 * Keeps the export*Atom family and the ?c= search param in sync:
 * - on mount, a ?c= param hydrates the atoms (a broken param is ignored
 *   and removed by the mirror below)
 * - every config change is mirrored into the URL with replace, so the
 *   current URL always reproduces the configured export — until the user
 *   resets everything to the defaults, which clears the param again
 */
export const useExportUrlSync = () => {
  const config = useAtomValue(exportConfigAtom)
  const setConfig = useSetAtom(setExportConfigAtom)
  const [searchParams, setSearchParams] = useSearchParams()

  // while set, the mirror ignores config changes until the hydrated value
  // arrives — prevents clobbering the shared param with the stale
  // pre-hydration config in the same effect flush
  const suppressMirrorRef = useRef<string | null>(null)

  // hydrate once on mount (StrictMode-safe via the ref)
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    const encoded = searchParams.get(exportConfigParamName)
    if (!encoded) return
    const decoded = decodeExportConfig(encoded)
    if (decoded) {
      suppressMirrorRef.current = encodeExportConfig(decoded)
      setConfig(decoded)
    }
  }, [searchParams, setConfig])

  useEffect(() => {
    const encoded = encodeExportConfig(config)
    if (suppressMirrorRef.current !== null) {
      if (encoded !== suppressMirrorRef.current) return
      suppressMirrorRef.current = null
    }
    const shouldHaveParam =
      encoded !== defaultExportConfigEncoded ? encoded : null
    // no-op when the URL already carries the current config — including
    // the re-run our own replace navigation triggers, so there is no loop
    if (searchParams.get(exportConfigParamName) === shouldHaveParam) return
    const next = new URLSearchParams(searchParams)
    if (shouldHaveParam === null) {
      next.delete(exportConfigParamName)
    } else {
      next.set(exportConfigParamName, shouldHaveParam)
    }
    setSearchParams(next, { replace: true })
  }, [config, searchParams, setSearchParams])
}
