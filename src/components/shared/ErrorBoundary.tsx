import { ErrorBoundary as ErrorBoundaryComponent, type FallbackProps } from 'react-error-boundary'
import Button from '@mui/material/Button'
import { useSetAtom } from 'jotai'

import { setLoginAtom } from '../../store'
import { reportError } from '../../modules/errorTelemetry'

import styles from './ErrorBoundary.module.css'

type ErrorFallbackProps = FallbackProps & {
  componentStack?: string
}

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }: ErrorFallbackProps) => {
  const onReload = () => {
    if (typeof window !== 'undefined') {
      ;(window.location.reload as (forceReload?: boolean) => void)(true)
    }
  }

  return (
    <div className={styles.container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={styles.preWrapping}>{(error as Error).message}</pre>
      <details className={styles.details}>
        <summary className={styles.summary}>Mehr Informationen</summary>
        <pre className={styles.pre}>{componentStack}</pre>
      </details>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          onClick={onReload}
          color="inherit"
          className={styles.button}
        >
          neu starten
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          onClick={resetErrorBoundary}
          color="inherit"
          className={styles.button}
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}

export const ErrorBoundary = ({ children }: { children?: React.ReactNode }) => {
  const setLogin = useSetAtom(setLoginAtom)

  const onReset = () => {
    if (typeof window !== 'undefined') {
      setLogin({
        username: null,
        token: null,
      })
      ;(window.location.reload as (forceReload?: boolean) => void)(true)
    }
  }

  return (
    <ErrorBoundaryComponent
      FallbackComponent={ErrorFallback}
      onError={(error) => void reportError('boundary', error)}
      onReset={onReset}
    >
      {children}
    </ErrorBoundaryComponent>
  )
}
