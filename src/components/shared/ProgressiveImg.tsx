import { useState, useEffect } from 'react'

import { img, imgLoading } from './ProgressiveImg.module.css'

export const ProgressiveImg = ({ placeholderSrc, src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSrc(src)
    }
  }, [src])

  const isLoading = placeholderSrc && imgSrc === placeholderSrc

  /**
   * TODO:
   * use picture element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
   * use uploadcare adaptive delivery (no need for offline fallback)
   * https://uploadcare.com/docs/delivery/adaptive-delivery/#adaptive-delivery
   */
  return (
    <img
      {...{ src: imgSrc, ...props }}
      alt={props.alt || ''}
      className={`${img} ${isLoading ? imgLoading : ''}`}
    />
  )
}
