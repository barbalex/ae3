import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouteError } from 'react-router'
import Button from '@mui/material/Button'

import { idbContext } from '../../idbContext.js'
import { storeContext } from '../../storeContext.js'

import {
  container,
  buttonContainer,
  button,
  preWrapping,
} from './RouterErrorBoundary.module.css'

export const RouterErrorBoundary = observer(({ children }) => {
  const error = useRouteError()

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
  const onReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }
  }

  return (
    <div className={container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={preWrapping}>{error.message}</pre>
      <div className={buttonContainer}>
        <Button
          className={button}
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </Button>
      </div>
      <div className={buttonContainer}>
        <Button
          className={button}
          variant="outlined"
          onClick={onReset}
          color="inherit"
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
})
