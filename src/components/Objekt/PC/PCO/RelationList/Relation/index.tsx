import { PropertyReadOnly } from '../../../../../shared/PropertyReadOnly'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary'
import { PropertyList } from './PropertyList'
import { getUrlForObject } from '../../../../../../modules/getUrlForObject'

import { parseProperties } from '../../../../../../modules/parseProperties'
import styles from './index.module.css'

type RelationProps = {
  relation: any
  intermediateRelation: boolean
}

export const Relation = ({ relation, intermediateRelation }: RelationProps) => {
  // never pass null to Object.entries!!!
  const properties = parseProperties(relation.properties)
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
