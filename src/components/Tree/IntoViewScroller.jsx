import { useEffect, useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import isElementInViewport from '../../../../modules/isElementInViewport'
import getLastIdFromUrl from '../../../../modules/getLastIdFromUrl'

const IntoViewScroller = () => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store.tree

  const scroller = useCallback(() => {
    // console.log('IntoViewScroller running')
    // 1. Get id from url
    const id = getLastIdFromUrl(activeNodeArray)
    if (!id) return setTimeout(scroller, 150)
    // 2. Get its element
    const element = document.getElementById(id)
    // 3. No element yet? Tree may still be loading > try later
    if (!element) return setTimeout(scroller, 150)
    // 4. Got an element but it is visible? do not scroll
    if (isElementInViewport(element)) return
    // console.log('IntoViewScroller, will scroll id into view:', id)
    // 5. Got an element and it is not visible? scroll it into view
    element?.scrollIntoView?.({
      block: 'center',
      inline: 'center',
    })
  }, [activeNodeArray])

  useEffect(() => {
    scroller()
  }, [scroller])

  return null
}

export default observer(IntoViewScroller)
