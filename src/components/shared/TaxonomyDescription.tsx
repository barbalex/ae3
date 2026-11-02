import Linkify from 'linkify-react'

import { PropertyReadOnly } from './PropertyReadOnly'
import { ErrorBoundary } from './ErrorBoundary'

import styles from './TaxonomyDescription.module.css'

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

type TaxonomyDescriptionProps = {
  taxonomy: {
    description?: string | null
    lastUpdated?: string | null
    links?: any[] | null
    organizationByOrganizationId?: { name?: string | null } | null
  }
}

export const TaxonomyDescription = ({ taxonomy }: TaxonomyDescriptionProps) => {
  const organizationName = taxonomy?.organizationByOrganizationId?.name

  return (
    <ErrorBoundary>
      <Linkify options={linkifyOptions}>
        <div className={styles.container}>
          {taxonomy.description && (
            <PropertyReadOnly
              label="Beschreibung"
              value={taxonomy.description}
            />
          )}
          {taxonomy.lastUpdated && (
            <PropertyReadOnly
              label="Stand"
              value={taxonomy.lastUpdated}
            />
          )}
          {taxonomy.links && taxonomy.links.length > 0 && (
            <PropertyReadOnly
              label="Link"
              value={taxonomy.links}
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
