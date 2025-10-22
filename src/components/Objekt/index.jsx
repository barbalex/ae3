import { useContext } from 'react'
import styled from '@emotion/styled'
import { uniqBy } from 'es-toolkit'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'

import { TaxonomyObjects } from './TaxonomyObjects/index.jsx'
import { TaxonomyObject } from './TaxonomyObjects/TaxonomyObject/index.jsx'
import { PC } from './PC/index.jsx'
import { getActiveObjectIdFromNodeArray } from '../../modules/getActiveObjectIdFromNodeArray.js'
import query from './query.js'
import querySynonyms from './querySynonyms.js'
import storeContext from '../../storeContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

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

const getPropertyCollectionObjectsOfSynonyms = ({ synonymObjects, pcsIds }) => {
  let pCOs = []
  synonymObjects.forEach((synonym) => {
    pCOs = [
      ...pCOs,
      ...(synonym?.propertyCollectionObjectsByObjectId?.nodes ?? []),
    ]
  })
  pCOs = uniqBy(pCOs, (pco) => pco.propertyCollectionId)
  pCOs = pCOs.filter((pco) => !pcsIds.includes(pco.propertyCollectionId))
  return pCOs
}

export const Objekt = observer(({ stacked = false }) => {
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
  const { data: synonymData } = useQuery(querySynonyms, {
    variables: {
      objectIds: synonymIds,
    },
  })

  const pcs = objectData?.pcs?.nodes ?? []
  const synonymPcs = synonymData?.pcs?.nodes ?? []

  const pcsIds = pcs.map((c) => c.id)
  const synonymObjects = synonyms.map((s) => s.objectByObjectIdSynonym)

  const propertyCollectionObjectsOfSynonyms =
    getPropertyCollectionObjectsOfSynonyms({ synonymObjects, pcsIds })

  if (!objekt) return <div />

  if (objectLoading) return <Spinner />
  if (objectError) {
    return <Container2>{`Fehler: ${objectError.message}`}</Container2>
  }

  // console.log('hello Objekt', {
  //   objekt,
  //   pcs,
  //   synonymPcs,
  //   synonyms,
  // })

  return (
    <ErrorBoundary>
      <Container>
        <SimpleBar style={{ maxHeight: '100%' }}>
          <FirstTitle>Taxonomie</FirstTitle>
          <TaxonomyObject
            objekt={objekt}
            stacked={stacked}
          />
          {synonymObjects.length > 0 && (
            <SynonymTitle>
              {synonymObjects.length > 1 ? 'Synonyme' : 'Synonym'}
              <TitleSpan>
                {synonymObjects.length > 1 ? ` (${synonymObjects.length})` : ''}
              </TitleSpan>
            </SynonymTitle>
          )}
          <TaxonomyObjects
            objects={synonymObjects}
            stacked={stacked}
          />
          {pcs.length > 0 && (
            <Title>
              Eigenschaften
              <TitleSpan>{` (${pcs.length} ${
                pcs.length > 1 ? 'Sammlungen' : 'Sammlung'
              })`}</TitleSpan>
            </Title>
          )}
          {pcs.map((pc) => (
            <PC
              key={pc.id}
              pcId={pc.id}
              objId={objekt.id}
              stacked={stacked}
              isSynonym={false}
            />
          ))}
          {synonymPcs.length > 0 && (
            <Title>
              Eigenschaften von Synonymen
              <TitleSpan>
                {` (${synonymPcs.length} ${
                  synonymPcs.length > 1 ? 'Sammlungen' : 'Sammlung'
                })`}
              </TitleSpan>
            </Title>
          )}
          {synonymPcs.map((pc) => (
            <PC
              key={pc.id}
              pcId={pc.id}
              objId={objekt?.synonymsByObjectId?.nodes?.[0]?.objectIdSynonym}
              stacked={stacked}
            />
          ))}
        </SimpleBar>
      </Container>
    </ErrorBoundary>
  )
})
