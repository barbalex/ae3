import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { AllChooser } from './AllChooser.jsx'
import { Properties } from './Properties.jsx'
import { Spinner } from '../../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../../store/index.ts'

import { rpc } from '../../../../../../../modules/api.js'
import styles from './index.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const Chooser = ({ pcName, count }) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['pcoPropertiesByTaxonomiesAndPc', exportTaxonomies, pcName],
    queryFn: async () => ({
        data: { pcoPropertiesByTaxonomiesAndPc: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('pco_properties_by_taxonomies_and_pc', { taxonomy_names: exportTaxonomies, pc_name: pcName })).map((r) => r) } },
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
