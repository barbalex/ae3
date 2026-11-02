import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PcoProperty } from './Property'
import { Spinner } from '../../../../../shared/Spinner'
import { exportTaxonomiesAtom } from '../../../../../../store'

import { rpc } from '../../../../../../modules/api'
import styles from './Properties.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

type PropertiesProps = {
  pc: string
}

export const Properties = ({ pc }: PropertiesProps) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportFilterPcos', exportTaxonomies, pc],
    queryFn: async () => ({
        data: { pcoPropertiesByTaxonomiesAndPc: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('pco_properties_by_taxonomies_and_pc', { taxonomy_names: exportTaxonomies, pc_name: pc })).map((r: any) => r) } },
      }),
  })

  const properties = data?.data?.pcoPropertiesByTaxonomiesAndPc?.nodes ?? []

  if (error) {
    return `Error loading data: ${error.message}`
  }

  return (
    <Suspense fallback={fallback}>
      {properties.map((p: any) => (
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
