import { memo } from 'react'
import styled from '@emotion/styled'
import Linkify from 'react-linkify'

import { appBaseUrl } from '../../modules/appBaseUrl.js'
import { ErrorBoundary } from './ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
`
const Label = styled.p`
  flex-basis: 250px;
  text-align: right;
  padding-right: 5px;
  margin: 3px 0;
  padding: 2px;
  color: grey;
`
const UserContainer = styled.div`
  margin: 3px 0;
  padding: 2px;
  width: 100%;
`
const StyledA = styled.a`
  color: inherit;
  font-weight: 100;
  cursor: pointer;
  text-decoration-color: rgba(0, 0, 0, 0.3);
  text-decoration-style: dotted;
`
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

export const UserReadOnly = memo(({ label, user }) => {
  if (!user) return null

  const name = user ? user.name || '' : ''
  const email = user ? user.email || '' : ''
  const link = `${appBaseUrl}/Benutzer/${user.id}`

  return (
    <ErrorBoundary>
      <Linkify properties={linkifyProperties}>
        <Container className="property">
          <Label>{`${label}:`}</Label>
          <UserContainer>
            <StyledA href={link} target="_blank">
              {name}
            </StyledA>
            <span>{` (${email})`}</span>
          </UserContainer>
        </Container>
      </Linkify>
    </ErrorBoundary>
  )
})
