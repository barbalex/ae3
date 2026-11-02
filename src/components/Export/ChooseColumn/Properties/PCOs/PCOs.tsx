import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PCO } from './PCO'
import { rpc } from '../../../../../modules/api'
import { Spinner } from '../../../../shared/Spinner'
import { exportTaxonomiesAtom } from '../../../../../store'

import styles from './PCOs.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const PcoList = () => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnPropertiesPcos', exportTaxonomies],
    queryFn: async () => ({
        data: {
          pcoPropertiesByTaxonomiesCountPerPc: {
            nodes: exportTaxonomies.length === 0 ?
              []
            : await rpc('pco_properties_by_taxonomies_count_per_pc', {
                export_taxonomies: exportTaxonomies,
              }),
          },
        },
      }),
  })
  const nodes = data?.data?.pcoPropertiesByTaxonomiesCountPerPc?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  return (
    <Suspense fallback={fallback}>
      {nodes.map(({ name, count }: any) => (
        <PCO
          key={name}
          pcName={name}
          count={count}
        />
      ))}
    </Suspense>
  )
}
