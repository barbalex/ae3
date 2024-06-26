import { memo } from 'react'
import styled from '@emotion/styled'
import Linkify from 'react-linkify'

import { PropertyReadOnly } from './PropertyReadOnly.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  background-color: #ffe0b2 !important;
  padding: 8px 16px !important;
  margin: 0;
  column-width: 500px;
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

export const TaxonomyDescription = memo(({ taxonomy }) => {
  const organizationName = taxonomy?.organizationByOrganizationId?.name

  return (
    <ErrorBoundary>
      <Linkify properties={linkifyProperties}>
        <Container>
          {taxonomy.description && (
            <PropertyReadOnly
              label="Beschreibung"
              value={taxonomy.description}
            />
          )}
          {taxonomy.lastUpdated && (
            <PropertyReadOnly label="Stand" value={taxonomy.lastUpdated} />
          )}
          {taxonomy.links && taxonomy.links.length > 0 && (
            <PropertyReadOnly label="Link" value={taxonomy.links} />
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
