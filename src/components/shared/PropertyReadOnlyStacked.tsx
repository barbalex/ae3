import TextField from '@mui/material/TextField'
import Linkify from 'linkify-react'

import { ErrorBoundary } from './ErrorBoundary'
import styles from './PropertyReadOnlyStacked.module.css'

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

type PropertyReadOnlyStackedProps = {
  label: string
  value: React.ReactNode
}

export const PropertyReadOnlyStacked = ({ label, value }: PropertyReadOnlyStackedProps) => {
  let val: React.ReactNode = value
  if (val === true) val = 'ja'
  if (val === false) val = 'nein'

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Linkify options={linkifyOptions}>
          <TextField
            label={label}
            value={val}
            fullWidth
            multiline
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            variant="standard"
          />
        </Linkify>
      </div>
    </ErrorBoundary>
  )
}
