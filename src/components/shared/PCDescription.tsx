import Linkify from 'linkify-react'

import { PropertyReadOnly } from './PropertyReadOnly'
import { ErrorBoundary } from './ErrorBoundary'

import styles from './PCDescription.module.css'

const linkifyOptions = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
    cursor: 'pointer',
    textDecorationColor: 'rgba(0, 0, 0, 0.3)',
    textDecorationStyle: 'dotted',
  },
}

type PCDescriptionProps = {
  pC: {
    description?: string | null
    combining?: boolean | null
    lastUpdated?: string | null
    links?: any[] | null
    termsOfUse?: string | null
    userByImportedBy?: { name?: string | null; email?: string | null } | null
    organizationByOrganizationId?: { name?: string | null } | null
  }
}

export const PCDescription = ({ pC }: PCDescriptionProps) => {
  const userImportedByName = pC?.userByImportedBy?.name
  const userImportedByEmail = pC?.userByImportedBy?.email
  const organizationName = pC?.organizationByOrganizationId?.name

  return (
    <ErrorBoundary>
      <Linkify options={linkifyOptions}>
        <div className={styles.container}>
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
