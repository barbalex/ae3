import React, { useContext } from 'react'
import styled from '@emotion/styled'
import uniqBy from 'lodash/uniqBy'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'

import TaxonomyObjects from './TaxonomyObjects/index.jsx'
import TaxonomyObject from './TaxonomyObjects/TaxonomyObject/index.jsx'
import PC from './PC/index.jsx'
import getActiveObjectIdFromNodeArray from '../../modules/getActiveObjectIdFromNodeArray.js'
import query from './query.js'
import querySynonyms from './querySynonyms.js'
import storeContext from '../../storeContext.js'
import Spinner from '../shared/Spinner.jsx'
import ErrorBoundary from '../shared/ErrorBoundary.jsx'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`
const Container2 = styled.div`
  padding: 10px;
`
const Title = styled.h3`
  margin: 15px 0 -5px 0;
  padding-left: 12px;
`
const TitleSpan = styled.span`
  font-weight: normal;
  font-size: small;
  margin-left: 4px;
`
const FirstTitle = styled(Title)`
  margin: 10px 0 5px 0;
`
const SynonymTitle = styled(Title)`
  margin-bottom: 5px;
`

const Objekt = ({ stacked = false }) => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)

  const objectId = getActiveObjectIdFromNodeArray(activeNodeArray)
  const {
    data: objectData,
    loading: objectLoading,
    error: objectError,
  } = useQuery(query, {
    variables: {
      objectId,
    },
  })
  const objekt = objectData?.objectById
  const synonyms = objekt?.synonymsByObjectId?.nodes ?? []
  const synonymIds = synonyms.map((s) => s.objectByObjectIdSynonym.id)
  const {
    data: synonymData,
    loading: synonymLoading,
    error: synonymError,
  } = useQuery(querySynonyms, {
    variables: {
      objectIds: synonymIds,
    },
  })

  if (!objekt) return <div />

  const pcs = objectData?.pcs?.nodes ?? []
  const synonymPcs = synonymData?.pcs?.nodes ?? []

  const pcsIds = pcs.map((c) => c.id)
  const synonymObjects = synonyms.map((s) => s.objectByObjectIdSynonym)
  let propertyCollectionObjectsOfSynonyms = []
  synonymObjects.forEach((synonym) => {
    propertyCollectionObjectsOfSynonyms = [
      ...propertyCollectionObjectsOfSynonyms,
      ...(synonym?.propertyCollectionObjectsByObjectId?.nodes ?? []),
    ]
  })
  propertyCollectionObjectsOfSynonyms = uniqBy(
    propertyCollectionObjectsOfSynonyms,
    (pco) => pco.propertyCollectionId,
  )
  propertyCollectionObjectsOfSynonyms =
    propertyCollectionObjectsOfSynonyms.filter(
      (pco) => !pcsIds.includes(pco.propertyCollectionId),
    )

  if (objectLoading) return <Spinner />
  if (objectError) {
    return <Container2>{`Fehler: ${objectError.message}`}</Container2>
  }

  console.log('hello Objekt', {
    objekt,
    // synonymObjects,
    // propertyCollectionObjects,
    // relations,
    // pcsIds,
    // propertyCollectionIdsOfRelations,
    pcs,
    synonymPcs,
    synonymData,
    synonyms,
    synonymIds,
    synonymLoading,
    synonymError,
  })

  return (
    <ErrorBoundary>
      <Container>
        <SimpleBar style={{ maxHeight: '100%' }}>
          <FirstTitle>Taxonomie</FirstTitle>
          <TaxonomyObject objekt={objekt} stacked={stacked} />
          {synonymObjects.length > 0 && (
            <SynonymTitle>
              {synonymObjects.length > 1 ? 'Synonyme' : 'Synonym'}
              <TitleSpan>
                {synonymObjects.length > 1 ? ` (${synonymObjects.length})` : ''}
              </TitleSpan>
            </SynonymTitle>
          )}
          <TaxonomyObjects objects={synonymObjects} stacked={stacked} />
          {pcs.length > 0 && (
            <Title>
              Eigenschaften
              <TitleSpan>{` (${pcs.length} ${
                pcs.length > 1 ? 'Sammlungen' : 'Sammlung'
              })`}</TitleSpan>
            </Title>
          )}
          {pcs.map((pc) => (
            <PC key={pc.id} pcId={pc.id} objId={objekt.id} stacked={stacked} />
          ))}
          {propertyCollectionObjectsOfSynonyms.length > 0 && (
            <Title>
              Eigenschaften von Synonymen
              <TitleSpan>
                {` (${propertyCollectionObjectsOfSynonyms.length} ${
                  propertyCollectionObjectsOfSynonyms.length > 1
                    ? 'Sammlungen'
                    : 'Sammlung'
                })`}
              </TitleSpan>
            </Title>
          )}
          <PC pcIds={propertyCollectionObjectsOfSynonyms} stacked={stacked} />
        </SimpleBar>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Objekt)
