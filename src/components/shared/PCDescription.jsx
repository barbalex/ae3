import Linkify from 'react-linkify'

import { PropertyReadOnly } from './PropertyReadOnly.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

import { container } from './PCDescription.module.css'

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

export const PCDescription = ({ pC }) => {
  const userImportedByName = pC?.userByImportedBy?.name
  const userImportedByEmail = pC?.userByImportedBy?.email
  const organizationName = pC?.organizationByOrganizationId?.name

  return (
    <ErrorBoundary>
      <Linkify properties={linkifyProperties}>
        <div className={container}>
          {pC.description && (
            <PropertyReadOnly
              label="Beschreibung"
              value={pC.description}
            />
          )}
          {pC.combining && (
            <PropertyReadOnly
              label="Zusammenfassend"
              value={pC.combining ? 'ja' : 'nein'}
            />
          )}
          {pC.lastUpdated && (
            <PropertyReadOnly
              label="Stand"
              value={pC.lastUpdated}
            />
          )}
          {pC.links && pC.links.length > 0 && (
            <PropertyReadOnly
              label="Link"
              value={pC.links}
            />
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
        </div>
      </Linkify>
    </ErrorBoundary>
  )
}
