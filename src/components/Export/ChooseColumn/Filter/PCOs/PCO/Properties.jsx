import { Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PcoProperty } from './Property/index.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../store/index.ts'

import styles from './Properties.module.css'

const query = gql`
  query propsByTaxDataQueryForFilterPCO(
    $exportTaxonomies: [String]
    $pcName: String!
  ) {
    pcoPropertiesByTaxonomiesAndPc(
      taxonomyNames: $exportTaxonomies
      pcName: $pcName
    ) {
      totalCount
      nodes {
        property
        type
      }
    }
  }
`

const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const Properties = ({ pc }) => {
  const apolloClient = useApolloClient()

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportFilterPcos', exportTaxonomies, pc],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
          pcName: pc,
        },
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
