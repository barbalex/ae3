import React, { useContext } from 'react'
import styled from '@emotion/styled'
import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'

import TaxonomyObjects from '../TaxonomyObjects/index.jsx'
import TaxonomyObject from '../TaxonomyObjects/TaxonomyObject/index.jsx'
import PCOs from './PCOs/index.jsx'
import getActiveObjectIdFromNodeArray from '../../../modules/getActiveObjectIdFromNodeArray.js'
import query from './query.js'
import storeContext from '../../../storeContext.js'
import Spinner from '../../shared/Spinner.jsx'
import ErrorBoundary from '../../shared/ErrorBoundary.jsx'

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

const PC = ({ pcIds, stacked = false }) => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)

  const objectId = getActiveObjectIdFromNodeArray(activeNodeArray)
  const {
    data: objectData,
    loading: objectLoading,
    error: objectError,
  } = useQuery(query, {
    variables: {
      pcIds,
    },
  })

  const objekt = objectData?.objectById
  if (!objekt) return <div />

  const propertyCollectionObjects =
    objekt?.propertyCollectionObjectsByObjectId?.nodes ?? []
  const relations = objekt?.relationsByObjectId?.nodes ?? []
  const propertyCollectionIdsOfPropertyCollectionObjects = [
    ...new Set(
      propertyCollectionObjects.map((pco) => pco.propertyCollectionId),
    ),
  ]
  const propertyCollectionsOfPCOsUngrouped = propertyCollectionObjects.map(
    (pco) => pco.propertyCollectionByPropertyCollectionId,
  )
  const propertyCollectionIdsOfRelations = [
    ...new Set(relations.map((r) => r.propertyCollectionId)),
  ]
  const propertyCollectionsOfRelationsUngrouped = relations.map(
    (r) => r.propertyCollectionByPropertyCollectionId,
  )
  const propertyCollections = Object.values(
    groupBy(
      [
        ...propertyCollectionsOfPCOsUngrouped,
        ...propertyCollectionsOfRelationsUngrouped,
      ],
      'id',
    ),
  ).map((pc) => pc[0])
  const propertyCollectionIds = [
    ...new Set([
      ...propertyCollectionIdsOfPropertyCollectionObjects,
      ...propertyCollectionIdsOfRelations,
    ]),
  ]
  const synonyms = objekt?.synonymsByObjectId?.nodes ?? []
  const synonymObjects = synonyms.map((s) => s.objectByObjectIdSynonym)
  // const propertyCollectionIds = propertyCollectionObjects.map(
  //   (pco) => pco.propertyCollectionId,
  // )
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
      (pco) => !propertyCollectionIds.includes(pco.propertyCollectionId),
    )

  if (objectLoading) return <Spinner />
  if (objectError) {
    return <Container2>{`Fehler: ${objectError.message}`}</Container2>
  }

  console.log('hello Objekt', {
    objekt,
    synonymObjects,
    propertyCollectionObjects,
    relations,
    propertyCollectionIds,
    propertyCollectionIdsOfPropertyCollectionObjects,
    propertyCollectionIdsOfRelations,
    propertyCollectionsOfPCOsUngrouped,
    propertyCollectionsOfRelationsUngrouped,
    propertyCollections,
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
          {propertyCollections.length > 0 && (
            <Title>
              Eigenschaften
              <TitleSpan>{` (${propertyCollections.length} ${
                propertyCollections.length > 1 ? 'Sammlungen' : 'Sammlung'
              })`}</TitleSpan>
            </Title>
          )}
          <PCOs
            pCOs={propertyCollectionObjects}
            pCs={propertyCollections}
            relations={relations}
            stacked={stacked}
          />
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
          <PCOs
            pCOs={propertyCollectionObjectsOfSynonyms}
            relations={relations}
            stacked={stacked}
          />
        </SimpleBar>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PC)
