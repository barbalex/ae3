import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { ErrorBoundary as ErrorBoundaryComponent } from 'react-error-boundary'
import Button from '@mui/material/Button'

import { idbContext } from '../../idbContext.js'
import { storeContext } from '../../storeContext.js'

import {
  container,
  buttonContainer,
  button,
  details,
  summary,
  preWrapping,
  pre,
} from './ErrorBoundary.module.css'

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => {
  const onReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }
  }

  return (
    <div className={container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={preWrapping}>{error.message}</pre>
      <details className={details}>
        <summary className={summary}>Mehr Informationen</summary>
        <pre className={pre}>{componentStack}</pre>
      </details>
      <div className={buttonContainer}>
        <Button
          variant="outlined"
          onClick={onReload}
          color="inherit"
          className={button}
        >
          neu starten
        </Button>
      </div>
      <div className={buttonContainer}>
        <Button
          variant="outlined"
          onClick={resetErrorBoundary}
          color="inherit"
          className={button}
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}

export const ErrorBoundary = observer(({ children }) => {
  const idb = useContext(idbContext)
  const store = useContext(storeContext)

  const onReset = () => {
    const { login } = store
    const { setLogin } = login

    if (typeof window !== 'undefined') {
      idb.users.clear()
      setLogin({
        username: '',
        token: '',
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
})
