import { Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PCO } from './PCO/index.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './PCOs.module.css'

const query = gql`
  query propsByTaxDataQueryForPropertiesPCOs($exportTaxonomies: [String!]) {
    pcoPropertiesByTaxonomiesCountPerPc(exportTaxonomies: $exportTaxonomies) {
      nodes {
        name
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

export const PcoList = () => {
  const apolloClient = useApolloClient()

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnPropertiesPcos', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
        },
      }),
  })
  const nodes = data?.data?.pcoPropertiesByTaxonomiesCountPerPc?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  return (
    <Suspense fallback={fallback}>
      {nodes.map(({ name, count }) => (
        <PCO
          key={name}
          pcName={name}
          count={count}
        />
      ))}
    </Suspense>
  )
}
