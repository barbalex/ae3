import { Suspense } from 'react'
import { groupBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RCO } from './RCO/index.jsx'
import { rpc } from '../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './List.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RcoList = () => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnFilterRcoList', exportTaxonomies],
    queryFn: async () => ({
        data: { rcoPropertiesByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('rco_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r) => ({propertyCollectionName: r.property_collection_name, relationType: r.relation_type, propertyName: r.property_name, jsontype: r.jsontype, count: r.count})) } },
      }),
  })

  const rcoProperties =
    data?.data?.rcoPropertiesByTaxonomiesFunction?.nodes ?? []

  const rcoPropertiesByPropertyCollection = groupBy(rcoProperties, (x) => {
    if (x.propertyCollectionName.includes(x.relationType)) {
      return x.propertyCollectionName
    }
    return `${x.propertyCollectionName}: ${x.relationType}`
  })

  if (error) {
    return (
      <div className={styles.errorContainer}>
        `Error loading data: ${error.message}`
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {Object.keys(rcoPropertiesByPropertyCollection).map((pc) => (
          <RCO
            key={pc}
            pc={pc}
          />
        ))}
      </Suspense>
    </ErrorBoundary>
  )
}
