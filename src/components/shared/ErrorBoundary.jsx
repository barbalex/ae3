import { ErrorBoundary as ErrorBoundaryComponent } from 'react-error-boundary'
import Button from '@mui/material/Button'
import { useSetAtom } from 'jotai'

import { setLoginAtom } from '../../store/index.ts'

import styles from './ErrorBoundary.module.css'

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => {
  const onReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }
  }

  return (
    <div className={styles.container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={styles.preWrapping}>{error.message}</pre>
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

export const ErrorBoundary = ({ children }) => {
  const setLogin = useSetAtom(setLoginAtom)

  const onReset = () => {
    if (typeof window !== 'undefined') {
      setLogin({
        username: null,
        token: null,
      })
      window.location.reload(true)
    }
  }

  return (
    <ErrorBoundaryComponent
      FallbackComponent={ErrorFallback}
      onReset={onReset}
    >
      {children}
    </ErrorBoundaryComponent>
  )
}
