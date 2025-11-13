import Linkify from 'react-linkify'

import { ErrorBoundary } from './ErrorBoundary.jsx'
import {
  container,
  labelClass,
  valueClass,
} from './PropertyReadOnly.module.css'

const linkifyProperties = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
    cursor: 'pointer',
    textDecorationColor: 'rgba(0, 0, 0, 0.3)',
    textDecorationStyle: 'dotted',
  },
}

// when relations are passed in, a url is passed in too
// this enables linking to the related object
export const PropertyReadOnly = ({ label, value, url }) => {
  let val = value
  if (val === true) val = 'ja'
  if (val === false) val = 'nein'

  return (
    <ErrorBoundary>
      <Linkify properties={linkifyProperties}>
        <div className={container}>
          <p className={labelClass}>{`${label}:`}</p>
          <p className={valueClass}>
            {url ?
              <a href={url}>{val}</a>
            : val}
          </p>
        </div>
      </Linkify>
    </ErrorBoundary>
  )
}
