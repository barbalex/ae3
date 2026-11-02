import { useEffect } from 'react'
import { useAtomValue } from 'jotai'

import { isElementInViewport } from '../../modules/isElementInViewport'
import { getLastIdFromUrl } from '../../modules/getLastIdFromUrl'
import {
  scrollIntoViewCounterAtom,
  activeNodeArrayAtom,
} from '../../store'
import { useTreeScroll } from './treeScrollContext'

export const IntoViewScroller = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const scrollIntoViewCounter = useAtomValue(scrollIntoViewCounterAtom)
  const scrollIntoViewById = useTreeScroll()

  const scroller = () => {
    // 1. Get id from url
    const id = getLastIdFromUrl(activeNodeArray)
    if (!id) return
    // 2. Mounted (virtualization keeps offscreen rows unmounted) and
    // visible? do not scroll
    const element = document.getElementById(id)
    if (element && isElementInViewport(element)) return
    // 3. Resolve the id to a row index and let the virtualized list
    // scroll it into view. Not found? The tree may still be loading
    // deeper levels > try later
    const scrolled = scrollIntoViewById?.(id)
    if (!scrolled) setTimeout(scroller, 150)
  }

  useEffect(() => {
    scroller()
  }, [scroller, scrollIntoViewCounter])

  return null
}
