import { Suspense } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PcoProperty } from './Property/index.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../store/index.ts'

import { rpc } from '../../../../../../modules/api.js'
import styles from './Properties.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const Properties = ({ pc }) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportFilterPcos', exportTaxonomies, pc],
    queryFn: async () => ({
        data: { pcoPropertiesByTaxonomiesAndPc: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('pco_properties_by_taxonomies_and_pc', { taxonomy_names: exportTaxonomies, pc_name: pc })).map((r) => r) } },
      }),
  })

  const properties = data?.data?.pcoPropertiesByTaxonomiesAndPc?.nodes ?? []

  if (error) {
    return `Error loading data: ${error.message}`
  }

  return (
    <Suspense fallback={fallback}>
      {properties.map((p) => (
        <PcoProperty
          key={`${p.property}${p.type}`}
          pcname={pc}
          pname={p.property}
          jsontype={p.type}
        />
      ))}
    </Suspense>
  )
}
