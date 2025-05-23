import React, { useCallback } from 'react'
import Typography from '@mui/material/Typography'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router'

import { ErrorBoundary } from './shared/ErrorBoundary.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700 !important;
  text-shadow:
    2px 2px 3px white,
    -2px -2px 3px white,
    2px -2px 3px white,
    -2px 2px 3px white;
`
const PageTitle = styled(Typography)`
  font-size: 2em !important;
  padding: 15px;
  font-weight: 700 !important;
`
const Text = styled(Typography)`
  font-size: 1.5em !important;
  padding: 15px;
  font-weight: 700 !important;
`
const StyledButton = styled(Button)`
  text-shadow:
    2px 2px 3px white,
    -2px -2px 3px white,
    2px -2px 3px white,
    -2px 2px 3px white;
  border-color: white !important;
  margin-top: 10px !important;
`

const FourOFour = () => {
  const navigate = useNavigate()
  const onClickBack = useCallback(() => navigate('/'), [navigate])

  return (
    <ErrorBoundary>
      <Container>
        <TextContainer>
          <PageTitle
            align="center"
            variant="h6"
          >
            Oh je
          </PageTitle>
        </TextContainer>
        <TextContainer>
          <Text
            align="center"
            variant="h6"
          >
            Diese Seite ist nicht verfügbar.
          </Text>
        </TextContainer>
        <TextContainer>
          <StyledButton
            variant="outlined"
            onClick={onClickBack}
            color="inherit"
          >
            Zurück zur Startseite
          </StyledButton>
        </TextContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default FourOFour
