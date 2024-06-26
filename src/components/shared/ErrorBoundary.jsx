import React, { useCallback, useContext } from 'react'
import { ErrorBoundary as ErrorBoundaryComponent } from 'react-error-boundary'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import idbContext from '../../idbContext.js'
import storeContext from '../../storeContext.js'

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
const Details = styled.details`
  margin-bottom: 25px;
`
const Summary = styled.summary`
  user-select: none;
  &:focus {
    outline: none !important;
  }
`
const PreWrapping = styled.pre`
  white-space: normal;
`
const Pre = styled.pre`
  background-color: rgba(128, 128, 128, 0.09);
`

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => {
  const onReload = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }
  }, [])

  return (
    <Container>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <PreWrapping>{error.message}</PreWrapping>
      <Details>
        <Summary>Mehr Informationen</Summary>
        <Pre>{componentStack}</Pre>
      </Details>
      <ButtonContainer>
        <StyledButton variant="outlined" onClick={onReload} color="inherit">
          neu starten
        </StyledButton>
      </ButtonContainer>
      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={resetErrorBoundary}
          color="inherit"
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </StyledButton>
      </ButtonContainer>
    </Container>
  )
}

export const ErrorBoundary = ({ children }) => {
  const idb = useContext(idbContext)
  const store = useContext(storeContext)

  const onReset = useCallback(() => {
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
  }, [idb.users, store])

  return (
    <ErrorBoundaryComponent FallbackComponent={ErrorFallback} onReset={onReset}>
      {children}
    </ErrorBoundaryComponent>
  )
}

export default ErrorBoundary
