import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { AllChooser } from './AllChooser'
import { Properties } from './Properties'
import { Spinner } from '../../../../../../shared/Spinner'
import { exportTaxonomiesAtom } from '../../../../../../../store'

import { rpc } from '../../../../../../../modules/api'
import styles from './index.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

type ChooserProps = {
  pcName: string
  count: number
}

export const Chooser = ({ pcName, count }: ChooserProps) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['pcoPropertiesByTaxonomiesAndPc', exportTaxonomies, pcName],
    queryFn: async () => ({
        data: { pcoPropertiesByTaxonomiesAndPc: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('pco_properties_by_taxonomies_and_pc', { taxonomy_names: exportTaxonomies, pc_name: pcName })).map((r: any) => r) } },
      }),
  })

  const properties = data?.data?.pcoPropertiesByTaxonomiesAndPc?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  return (
    <Suspense fallback={fallback}>
      {count > 1 && (
        <AllChooser
          properties={properties}
          pcName={pcName}
        />
      )}
      <div className={styles.propertiesContainer}>
        <Properties
          properties={properties}
          pcName={pcName}
        />
      </div>
    </Suspense>
  )
}
