import React from 'react'
import styled from '@emotion/styled'
import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import PCOs from './PCOs/index.jsx'
import query from './query.js'
import Spinner from '../../shared/Spinner.jsx'
import ErrorBoundary from '../../shared/ErrorBoundary.jsx'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`
const Container2 = styled.div`
  padding: 10px;
`

const PC = ({ pcId, objId, stacked = false }) => {
  const { data, loading, error } = useQuery(query, {
    variables: {
      pcId,
      objId,
    },
  })

  const objekt = data?.objectById
  const pc = data?.propertyCollectionById
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

  if (loading) return <Spinner />
  if (error) {
    return <Container2>{`Fehler: ${error.message}`}</Container2>
  }

  // console.log('hello Objekt', {
  //   objekt,
  //   pc,
  // })

  return (
    <ErrorBoundary>
      <Container>
        <PCOs
          pCOs={propertyCollectionObjects}
          pCs={propertyCollections}
          relations={relations}
          stacked={stacked}
        />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PC)
