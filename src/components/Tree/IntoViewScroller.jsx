import { useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../storeContext.js'
import { isElementInViewport } from '../../modules/isElementInViewport.js'
import { getLastIdFromUrl } from '../../modules/getLastIdFromUrl.js'

export const IntoViewScroller = observer(() => {
  const store = useContext(storeContext)
  const { activeNodeArray, scrollIntoViewCounter } = store

  const scroller = () => {
    // 1. Get id from url
    const id = getLastIdFromUrl(activeNodeArray)
    // console.log('IntoViewScroller, id:', id)
    if (!id) {
      // console.log('IntoViewScroller, no id, return')
      return
    }
    // 2. Get its element
    const element = document.getElementById(id)
    // console.log('IntoViewScroller, element:', element)
    // 3. No element yet? Tree may still be loading > try later
    if (!element) return setTimeout(scroller, 150)
    // 4. Got an element but it is visible? do not scroll
    // console.log(
    //   'IntoViewScroller, element is in viewport',
    //   isElementInViewport(element),
    // )
    if (isElementInViewport(element)) return
    // console.log('IntoViewScroller, will scroll id into view:', id)
    // 5. Got an element and it is not visible? scroll it into view
    // console.log('IntoViewScroller, will scroll into view')
    element?.scrollIntoView?.({
      block: 'center',
      inline: 'center',
    })
  }

  useEffect(() => {
    scroller()
  }, [scroller, scrollIntoViewCounter])

  return null
})
