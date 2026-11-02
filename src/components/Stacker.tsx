import { useEffect, useCallback, useMemo } from 'react'
import { debounce } from 'es-toolkit'
import { useSetAtom } from 'jotai'

import {
  stackedAtom,
  windowWidthAtom,
  windowHeightAtom,
} from '../store'

export const Stacker = () => {
  const setStacked = useSetAtom(stackedAtom)
  const setWindowWidth = useSetAtom(windowWidthAtom)
  const setWindowHeight = useSetAtom(windowHeightAtom)

  // manual memoization stays despite the react compiler: vitest
  // runs without it, and the listener pairing below needs these
  // stable identities
  const updateStacked = useCallback(() => {
    if (typeof window === 'undefined') return
    const w = window
    const d = document
    const e = d.documentElement
    const g = d.getElementsByTagName('body')[0]
    const windowWidth = w.innerWidth || e.clientWidth || g.clientWidth
    const windowHeight = w.innerHeight || e.clientHeight || g.clientHeight
    const shouldBeStacked = windowWidth < 700
    setStacked(shouldBeStacked)
    setWindowWidth(windowWidth)
    setWindowHeight(windowHeight)
  }, [setStacked, setWindowWidth, setWindowHeight])

  // one stable debounced handler so the effect can actually remove
  // what it registered (the former cleanup removed the undebounced
  // function, which never matched)
  const debouncedUpdateStacked = useMemo(
    () => debounce(updateStacked, 100),
    [updateStacked],
  )

  useEffect(() => {
    updateStacked()
  }, [updateStacked])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('resize', debouncedUpdateStacked)
    return () => {
      window.removeEventListener('resize', debouncedUpdateStacked)
    }
  }, [debouncedUpdateStacked])

  return null
}
