import { memo } from 'react'
import styled from '@emotion/styled'
import Linkify from 'react-linkify'

import { PropertyReadOnly } from './PropertyReadOnly.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  padding: 13px 16px;
  background-color: #ffe0b2;
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

export const PCDescription = memo(({ pC }) => {
  const userImportedByName = pC?.userByImportedBy?.name
  const userImportedByEmail = pC?.userByImportedBy?.email
  const organizationName = pC?.organizationByOrganizationId?.name

  return (
    <ErrorBoundary>
      <Linkify properties={linkifyProperties}>
        <Container>
          {pC.description && (
            <PropertyReadOnly label="Beschreibung" value={pC.description} />
          )}
          {pC.combining && (
            <PropertyReadOnly
              label="Zusammenfassend"
              value={pC.combining ? 'ja' : 'nein'}
            />
          )}
          {pC.lastUpdated && (
            <PropertyReadOnly label="Stand" value={pC.lastUpdated} />
          )}
          {pC.links && pC.links.length > 0 && (
            <PropertyReadOnly label="Link" value={pC.links} />
          )}
          {pC.termsOfUse && (
            <PropertyReadOnly
              label="Nutzungsbedingungen"
              value={pC.termsOfUse}
            />
          )}
          {userImportedByName && (
            <PropertyReadOnly
              label="Importiert von"
              value={`${userImportedByName}${
                userImportedByEmail ? ` (${userImportedByEmail})` : ``
              }`}
            />
          )}
          {organizationName && (
            <PropertyReadOnly
              label="Organisation mit Schreibrecht"
              value={organizationName}
            />
          )}
        </Container>
      </Linkify>
    </ErrorBoundary>
  )
})
