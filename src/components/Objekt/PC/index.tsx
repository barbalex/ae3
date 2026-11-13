import { useQuery, keepPreviousData } from '@tanstack/react-query'

import { PcPresentation } from './PCO'
import { apiFetch } from '../../../modules/api'
import { attachParentChain } from '../../../modules/attachParentChain'
import { ErrorBoundary } from '../../shared/ErrorBoundary'

import styles from './index.module.css'

const pcFields =
  'id,name,description,links,combining,lastUpdated:last_updated,termsOfUse:terms_of_use,importedBy:imported_by,organizationByOrganizationId:organization_id(id,name),userByImportedBy:imported_by(id,name,email)'

type PCProps = {
  pcId: string
  objId?: string
  isSynonym?: boolean
}

export const PC = ({ pcId, objId }: PCProps) => {
  const { data, error } = useQuery({
    queryKey: ['pc', pcId, objId],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const pcs = await apiFetch(
        `/property_collection?id=eq.${pcId}&select=${pcFields},pcos:property_collection_object!property_collection_object_property_collection_id_fkey(id,objectId:object_id,propertyCollectionId:property_collection_id,propertyCollectionOfOrigin:property_collection_of_origin,properties,propertyCollectionByPropertyCollectionId:property_collection_id(${pcFields})),relations:relation!relation_property_collection_id_fkey(id,propertyCollectionId:property_collection_id,objectId:object_id,objectIdRelation:object_id_relation,relationType:relation_type,properties,objectByObjectIdRelation:object!relation_object_id_relation_fkey(id,name,taxonomyByTaxonomyId:taxonomy_id(id,name,type)))&pcos.object_id=eq.${objId}&relations.object_id=eq.${objId}`,
      )
      const pC = pcs?.[0]
      if (!pC) return null
      // attach ancestor chains for url building
      // (formerly recursive graphql queries)
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
    return (
      <div className={styles.errorContainer}>{`Fehler: ${error.message}`}</div>
    )
  }

  // don't want too many spinners
  return (
    <ErrorBoundary>
      <PcPresentation pC={pC} />
    </ErrorBoundary>
  )
}
