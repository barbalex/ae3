import { PropertyReadOnly } from '../../../../../shared/PropertyReadOnly.jsx'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'
import { PropertyList } from './PropertyList.jsx'
import { getUrlForObject } from '../../../../../../modules/getUrlForObject.js'

import styles from './index.module.css'

export const Relation = ({ relation, intermediateRelation }) => {
  // never pass null to Object.entries!!!
  const properties = JSON.parse(relation.properties) || {}
  const taxType = (
    relation?.objectByObjectIdRelation?.taxonomyByTaxonomyId?.type ?? 'Objekt'
  )
    .replace('ART', 'Art')
    .replace('LEBENSRAUM', 'Lebensraum')

  return (
    <div
      className={styles.container}
      style={{
        borderBottom: intermediateRelation ? '1px solid #c6c6c6' : 'none',
        paddingTop: intermediateRelation ? 0 : 7,
      }}
    >
      <ErrorBoundary>
        <PropertyReadOnly
          value={`${
            relation?.objectByObjectIdRelation?.taxonomyByTaxonomyId?.name ?? ''
          }: ${relation?.objectByObjectIdRelation?.name ?? '(kein Name)'}`}
          label={taxType}
          url={`/${getUrlForObject(relation.objectByObjectIdRelation).join('/')}`}
        />
        {relation.relationType && (
          <PropertyReadOnly
            value={relation.relationType}
            label="Art der Beziehung"
          />
        )}
        {properties && <PropertyList properties={properties} />}
      </ErrorBoundary>
    </div>
  )
}
