import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'

import { PcPresentation } from './PCO/index.jsx'
import { apiFetch } from '../../../modules/api.js'
import { attachParentChain } from '../../../modules/attachParentChain.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

const pcFields =
  'id,name,description,links,combining,lastUpdated:last_updated,termsOfUse:terms_of_use,importedBy:imported_by,organizationByOrganizationId:organization_id(id,name),userByImportedBy:imported_by(id,name,email)'

export const PC = ({ pcId, objId }) => {
  const { data, error } = useQuery({
    queryKey: ['pc', pcId, objId],
    queryFn: async () => {
      const pcs = await apiFetch(
        `/property_collection?id=eq.${pcId}&select=${pcFields},pcos:property_collection_object!property_collection_object_property_collection_id_fkey(id,objectId:object_id,propertyCollectionId:property_collection_id,propertyCollectionOfOrigin:property_collection_of_origin,properties,propertyCollectionByPropertyCollectionId:property_collection_id(${pcFields})),relations:relation!relation_property_collection_id_fkey(id,propertyCollectionId:property_collection_id,objectId:object_id,objectIdRelation:object_id_relation,relationType:relation_type,properties,objectByObjectIdRelation:object!relation_object_id_relation_fkey(id,name,taxonomyByTaxonomyId:taxonomy_id(id,name,type)))&pcos.object_id=eq.${objId}&relations.object_id=eq.${objId}`,
      )
      const pC = pcs?.[0]
      if (!pC) return null
      // shape like the former graphql result and attach ancestor chains
      // for url building (formerly recursive graphql queries)
      pC.propertyCollectionObjectsByPropertyCollectionId = {
        totalCount: pC.pcos?.length ?? 0,
        nodes: pC.pcos ?? [],
      }
      pC.relationsByPropertyCollectionId = {
        totalCount: pC.relations?.length ?? 0,
        nodes: pC.relations ?? [],
      }
      for (const r of pC.relations ?? []) {
        if (r.objectByObjectIdRelation) {
          await attachParentChain(r.objectByObjectIdRelation)
        }
      }
      return pC
    },
  })

  const pC = data

  if (error) {
    return <div className={styles.errorContainer}>{`Fehler: ${error.message}`}</div>
  }

  // don't want too many spinners
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <PcPresentation pC={pC} />
      </Suspense>
    </ErrorBoundary>
  )
}
