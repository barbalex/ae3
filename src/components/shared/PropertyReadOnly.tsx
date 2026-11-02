import Linkify from 'linkify-react'

import { ErrorBoundary } from './ErrorBoundary'
import styles from './PropertyReadOnly.module.css'

const linkifyOptions = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
    cursor: 'pointer',
    textDecorationColor: 'rgba(0, 0, 0, 0.3)',
    textDecorationStyle: 'dotted',
  },
}

type PropertyReadOnlyProps = {
  label: string
  value: React.ReactNode
  url?: string
}

// when relations are passed in, a url is passed in too
// this enables linking to the related object
export const PropertyReadOnly = ({ label, value, url }: PropertyReadOnlyProps) => {
  let val: React.ReactNode = value
  if (val === true) val = 'ja'
  if (val === false) val = 'nein'

  return (
    <ErrorBoundary>
      <Linkify options={linkifyOptions}>
        <div className={styles.container}>
          <p className={styles.labelClass}>{`${label}:`}</p>
          <p className={styles.valueClass}>
            {url ?
              <a href={url}>{val}</a>
            : val}
          </p>
        </div>
      </Linkify>
    </ErrorBoundary>
  )
}
