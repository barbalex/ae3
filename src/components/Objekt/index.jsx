import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { uniqBy } from 'es-toolkit'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'

import { TaxonomyObjects } from './TaxonomyObjects/index.jsx'
import { TaxonomyObject } from './TaxonomyObjects/TaxonomyObject/index.jsx'
import { PC } from './PC/index.jsx'
import { getActiveObjectIdFromNodeArray } from '../../modules/getActiveObjectIdFromNodeArray.js'
import { query } from './query.js'
import { querySynonyms } from './querySynonyms.js'
import { storeContext } from '../../storeContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import {
  container,
  errorContainer,
  title,
  titleSpan,
  firstTitle,
} from './index.module.css'

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

export const Objekt = observer(() => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const apolloClient = useApolloClient()

  const objectId = getActiveObjectIdFromNodeArray(activeNodeArray)
  const {
    data: objectData,
    error: objectError,
    refetch,
  } = useQuery({
    queryKey: ['object', objectId],
    queryFn: () =>
      apolloClient.query({
        query: query,
        variables: {
          objectId,
        },
      }),
    suspense: true,
  })
  const objekt = objectData?.data?.objectById
  const synonyms = objekt?.synonymsByObjectId?.nodes ?? []
  const synonymIds = synonyms.map((s) => s.objectByObjectIdSynonym.id)
  const { data: synonymData } = useQuery({
    queryKey: ['synonyms', synonymIds],
    queryFn: () =>
      apolloClient.query({
        query: querySynonyms,
        variables: {
          objectIds: synonymIds,
        },
      }),
    enabled: synonymIds.length > 0,
    suspense: true,
  })

  const pcs = objectData?.data?.pcs?.nodes ?? []
  const synonymPcs = synonymData?.data?.pcs?.nodes ?? []

  const pcsIds = pcs.map((c) => c.id)
  const synonymObjects = synonyms.map((s) => s.objectByObjectIdSynonym)

  const propertyCollectionObjectsOfSynonyms =
    getPropertyCollectionObjectsOfSynonyms({ synonymObjects, pcsIds })

  if (objectError) {
    return (
      <div className={errorContainer}>{`Fehler: ${objectError.message}`}</div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={container}>
        <SimpleBar style={{ maxHeight: '100%' }}>
          <h3 className={firstTitle}>Taxonomie</h3>
          <Suspense fallback={<Spinner />}>
            <TaxonomyObject
              objekt={objekt}
              refetch={refetch}
            />
            {synonymObjects.length > 0 && (
              <h3 className={title}>
                {synonymObjects.length > 1 ? 'Synonyme' : 'Synonym'}
                <span className={titleSpan}>
                  {synonymObjects.length > 1 ?
                    ` (${synonymObjects.length})`
                  : ''}
                </span>
              </h3>
            )}
            <TaxonomyObjects objects={synonymObjects} />
            {pcs.length > 0 && (
              <h3 className={title}>
                Eigenschaften
                <span className={titleSpan}>{` (${pcs.length} ${
                  pcs.length > 1 ? 'Sammlungen' : 'Sammlung'
                })`}</span>
              </h3>
            )}
            {pcs.map((pc) => (
              <PC
                key={pc.id}
                pcId={pc.id}
                objId={objekt?.id}
                isSynonym={false}
              />
            ))}
            {synonymPcs.length > 0 && (
              <h3 className={title}>
                Eigenschaften von Synonymen
                <span className={titleSpan}>
                  {` (${synonymPcs.length} ${
                    synonymPcs.length > 1 ? 'Sammlungen' : 'Sammlung'
                  })`}
                </span>
              </h3>
            )}
            {synonymPcs.map((pc) => (
              <PC
                key={pc.id}
                pcId={pc.id}
                objId={objekt?.synonymsByObjectId?.nodes?.[0]?.objectIdSynonym}
              />
            ))}
          </Suspense>
        </SimpleBar>
      </div>
    </ErrorBoundary>
  )
})
