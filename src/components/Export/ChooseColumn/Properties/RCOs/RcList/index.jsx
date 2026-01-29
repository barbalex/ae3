import { Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RCO } from './RCO/index.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../jotaiStore/index.ts'

import styles from './index.module.css'

const propsByTaxQuery = gql`
  query exportRcoListQuery($exportTaxonomies: [String]) {
    exportRcoList(exportTaxonomies: $exportTaxonomies) {
      nodes {
        pcname
        relationtype
        count
      }
    }
  }
`

const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RcList = () => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)
  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['exportRcoList', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query: propsByTaxQuery,
        variables: {
          exportTaxonomies,
          queryExportTaxonomies: exportTaxonomies.length > 0,
        },
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
