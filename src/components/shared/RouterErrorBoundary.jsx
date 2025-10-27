import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouteError } from 'react-router'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import { idbContext } from '../../idbContext.js'
import { storeContext } from '../../storeContext.js'

const Container = styled.div`
  padding: 15px;
`
const ButtonContainer = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
`
const StyledButton = styled(Button)`
  text-transform: none !important;
`
const PreWrapping = styled.pre`
  white-space: normal;
`

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
    <Container>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <PreWrapping>{error.message}</PreWrapping>
      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </StyledButton>
      </ButtonContainer>
      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={onReset}
          color="inherit"
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </StyledButton>
      </ButtonContainer>
    </Container>
  )
})
