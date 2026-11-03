import { useState, useEffect } from 'react'
import type { ComponentProps } from 'react'

import styles from './ProgressiveImg.module.css'

type ProgressiveImgProps = Omit<ComponentProps<'img'>, 'src'> & {
  placeholderSrc?: string
  src: string
}

export const ProgressiveImg = ({
  placeholderSrc,
  src,
  fetchPriority = 'auto',
  ...props
}: ProgressiveImgProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src)

  useEffect(() => {
    const img = new Image()
    img.fetchPriority = fetchPriority
    img.src = src
    img.onload = () => {
      setImgSrc(src)
    }
  }, [src, fetchPriority])

  const isLoading = placeholderSrc && imgSrc === placeholderSrc

  /**
   * TODO:
   * use picture element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
   * use uploadcare adaptive delivery (no need for offline fallback)
   * https://uploadcare.com/docs/delivery/adaptive-delivery/#adaptive-delivery
   */
  return (
    <img
      {...{ src: imgSrc ?? src, fetchPriority, ...props }}
      alt={props.alt || ''}
      className={`${styles.img} ${isLoading ? styles.imgLoading : ''}`}
    />
  )
}
