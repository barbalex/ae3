import { useEffect } from 'react'
import { debounce } from 'es-toolkit'
import { useSetAtom } from 'jotai'

import {
  stackedAtom,
  windowWidthAtom,
  windowHeightAtom,
} from '../store/index.ts'

export const Stacker = () => {
  const setStacked = useSetAtom(stackedAtom)
  const setWindowWidth = useSetAtom(windowWidthAtom)
  const setWindowHeight = useSetAtom(windowHeightAtom)

  const updateStacked = () => {
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
  }

  useEffect(() => {
    updateStacked()
  }, [updateStacked])

  useEffect(() => {
    typeof window !== 'undefined' &&
      window.addEventListener('resize', debounce(updateStacked, 100))
    return () => {
      typeof window !== 'undefined' &&
        window.removeEventListener('resize', updateStacked)
    }
  }, [updateStacked])

  return null
}
