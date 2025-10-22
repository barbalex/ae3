import styled from '@emotion/styled'

import { PropertyReadOnly } from '../../../../../shared/PropertyReadOnly.jsx'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'
import { PropertyList } from './PropertyList.jsx'
import { getUrlForObject } from '../../../../../../modules/getUrlForObject.js'

const Container = styled.div`
  border-bottom: ${(props) =>
    `${props['data-intermediaterelation'] ? '1px solid #c6c6c6' : 'none'}`};
  padding-top: ${(props) =>
    `${props['data-intermediaterelation'] ? 0 : '7px'}`};
  padding-bottom: 7px;
  column-width: 500px;
  .property p {
    margin-top: 1px;
    margin-bottom: 1px;
  }
`

export const Relation = ({ relation, intermediateRelation }) => {
  // never pass null to Object.entries!!!
  const properties = JSON.parse(relation.properties) || {}
  const taxType = (
    relation?.objectByObjectIdRelation?.taxonomyByTaxonomyId?.type ?? 'Objekt'
  )
    .replace('ART', 'Art')
    .replace('LEBENSRAUM', 'Lebensraum')

  return (
    <Container data-intermediaterelation={intermediateRelation}>
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
    </Container>
  )
}
