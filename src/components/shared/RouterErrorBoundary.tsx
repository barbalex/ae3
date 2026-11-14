import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import Button from '@mui/material/Button'
import { useSetAtom } from 'jotai'

import { setLoginAtom } from '../../store'
import { reportError } from '../../modules/errorTelemetry'

import styles from './RouterErrorBoundary.module.css'

export const RouterErrorBoundary = () => {
  const error = useRouteError() as Error

  useEffect(() => {
    void reportError('boundary', error)
  }, [error])

  const setLogin = useSetAtom(setLoginAtom)

  const onReset = () => {
    if (typeof window !== 'undefined') {
      setLogin({
        username: '',
        token: '',
      })
      ;(window.location.reload as (forceReload?: boolean) => void)(true)
    }
  }
  const onReload = () => {
    if (typeof window !== 'undefined') {
      ;(window.location.reload as (forceReload?: boolean) => void)(true)
    }
  }

  return (
    <div className={styles.container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={styles.preWrapping}>{error.message}</pre>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          variant="outlined"
          onClick={onReset}
          color="inherit"
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}
