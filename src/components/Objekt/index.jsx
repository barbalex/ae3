import { Suspense } from 'react'
import { uniqBy } from 'es-toolkit'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import SimpleBar from 'simplebar-react'
import { useAtomValue } from 'jotai'

import { TaxonomyObjects } from './TaxonomyObjects/index.jsx'
import { TaxonomyObject } from './TaxonomyObjects/TaxonomyObject/index.jsx'
import { PC } from './PC/index.jsx'
import { getActiveObjectIdFromNodeArray } from '../../modules/getActiveObjectIdFromNodeArray.js'
import { apiFetch } from '../../modules/api.js'
import { attachParentChain } from '../../modules/attachParentChain.js'
import { activeNodeArrayAtom } from '../../store/index.ts'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

const taxonomySelect =
  'taxonomyByTaxonomyId:taxonomy_id(id,name,type,description,links,lastUpdated:last_updated,importedBy:imported_by,termsOfUse:terms_of_use,habitatLabel:habitat_label,habitatComments:habitat_comments,habitatNrFnsMin:habitat_nr_fns_min,habitatNrFnsMax:habitat_nr_fns_max,organizationByOrganizationId:organization_id(id,name))'

// pcs referencing any of the objects via relation OR property_collection_object
// (the embeds are unaliased on purpose: postgrest only binds embed filters
// to unaliased hinted embeds)
const fetchPcsForObjectIds = async (objectIds) => {
  const ids = objectIds.join(',')
  const [byRelation, byPco] = await Promise.all([
    apiFetch(
      `/property_collection?select=id,name,relation!relation_property_collection_id_fkey!inner(object_id)&relation.object_id=in.(${ids})`,
    ),
    apiFetch(
      `/property_collection?select=id,name,property_collection_object!property_collection_object_property_collection_id_fkey!inner(object_id)&property_collection_object.object_id=in.(${ids})`,
    ),
  ])
  return uniqBy(
    [...(byRelation ?? []), ...(byPco ?? [])],
    (pc) => pc.id,
  ).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
}

export const Objekt = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)

  const unsafeObjectId = getActiveObjectIdFromNodeArray(activeNodeArray)
  const objectId = unsafeObjectId ?? '99999999-9999-9999-9999-999999999999'
  const {
    data: objectData,
    error: objectError,
    refetch,
  } = useQuery({
    queryKey: ['object', objectId],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const objects = await apiFetch(
        `/object?id=eq.${objectId}&select=id,taxonomyId:taxonomy_id,parentId:parent_id,name,properties,idOld:id_old,${taxonomySelect},synonymsByObjectId:synonym!synonym_object_id_fkey(objectId:object_id,objectIdSynonym:object_id_synonym,objectByObjectIdSynonym:object!synonym_object_id_synonym_fkey(id,taxonomyId:taxonomy_id,parentId:parent_id,name,properties,idOld:id_old,${taxonomySelect}))`,
      )
      const objekt = objects?.[0]
      if (!objekt) return { objekt: null, pcs: [] }
      // attach ancestor chains for url building (formerly recursive graphql)
      await attachParentChain(objekt)
      for (const s of objekt.synonymsByObjectId ?? []) {
        await attachParentChain(s.objectByObjectIdSynonym)
      }
      const pcs = await fetchPcsForObjectIds([objectId])
      return { objekt, pcs }
    },
    enabled: !!unsafeObjectId,
    suspense: true,
  })
  const objekt = objectData?.objekt
  const synonyms = objekt?.synonymsByObjectId ?? []
  const synonymIds = synonyms.map((s) => s.objectByObjectIdSynonym.id)
  const { data: synonymData } = useQuery({
    queryKey: ['synonyms', synonymIds],
    placeholderData: keepPreviousData,
    queryFn: () => fetchPcsForObjectIds(synonymIds),
    enabled: synonymIds.length > 0,
    suspense: true,
  })
  // guard against keepPreviousData showing pcs of a previous object's
  // synonyms when the current object has none
  const synonymPcs = synonymIds.length > 0 ? (synonymData ?? []) : []

  const pcs = objectData?.pcs ?? []

  const synonymObjects = synonyms.map((s) => s.objectByObjectIdSynonym)

  if (objectError) {
    return (
      <div
        className={styles.errorContainer}
      >{`Fehler: ${objectError.message}`}</div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <SimpleBar style={{ maxHeight: '100%' }}>
          <h3 className={styles.firstTitle}>Taxonomie</h3>
          <Suspense fallback={<Spinner />}>
            <TaxonomyObject
              objekt={objekt}
              refetch={refetch}
            />
            {synonymObjects.length > 0 && (
              <h3 className={styles.title}>
                {synonymObjects.length > 1 ? 'Synonyme' : 'Synonym'}
                <span className={styles.titleSpan}>
                  {synonymObjects.length > 1 ?
                    ` (${synonymObjects.length})`
                  : ''}
                </span>
              </h3>
            )}
            <TaxonomyObjects objects={synonymObjects} />
            {pcs.length > 0 && (
              <h3 className={styles.title}>
                Eigenschaften
                <span className={styles.titleSpan}>{` (${pcs.length} ${
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
            {(synonymPcs ?? []).length > 0 && (
              <h3 className={styles.title}>
                Eigenschaften von Synonymen
                <span className={styles.titleSpan}>
                  {` (${synonymPcs.length} ${
                    synonymPcs.length > 1 ? 'Sammlungen' : 'Sammlung'
                  })`}
                </span>
              </h3>
            )}
            {(synonymPcs ?? []).map((pc) => (
              <PC
                key={pc.id}
                pcId={pc.id}
                objId={synonyms?.[0]?.objectIdSynonym}
              />
            ))}
          </Suspense>
        </SimpleBar>
      </div>
    </ErrorBoundary>
  )
}
