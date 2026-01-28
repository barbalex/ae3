import { Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { AllChooser } from './AllChooser.jsx'
import { Properties } from './Properties.jsx'
import { Spinner } from '../../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../../jotaiStore/index.ts'

import styles from './index.module.css'

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

export const Chooser = ({ pcName, count }) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)
  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['pcoPropertiesByTaxonomiesAndPc', exportTaxonomies, pcName],
    queryFn: () =>
      apolloClient.query({
        query: query,
        variables: {
          exportTaxonomies,
          pcName,
        },
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
