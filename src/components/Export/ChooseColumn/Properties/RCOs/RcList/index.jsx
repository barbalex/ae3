import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RCO } from './RCO/index.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../store/index.ts'

import { rpc } from '../../../../../../modules/api.js'
import styles from './index.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RcList = () => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportRcoList', exportTaxonomies],
    queryFn: async () => ({
        data: { exportRcoList: { nodes: (await rpc('export_rco_list', { export_taxonomies: exportTaxonomies })) } },
      }),
  })

  const nodes = data?.data?.exportRcoList?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  return (
    <Suspense fallback={fallback}>
      {nodes.map(({ pcname, relationtype, count }) => (
        <RCO
          key={`${pcname}/${relationtype}}`}
          pcname={pcname}
          relationtype={relationtype}
          count={count}
        />
      ))}
    </Suspense>
  )
}
