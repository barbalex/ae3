import { useContext, Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../../storeContext.js'
import { AllChooser } from './AllChooser.jsx'
import { Properties } from './Properties.jsx'
import { Spinner } from '../../../../../../shared/Spinner.jsx'

import { propertiesContainer, spinnerContainer } from './index.module.css'

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
  <div className={spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const Chooser = observer(({ pcName, count }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()
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
        fetchPolicy: 'no-cache',
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
      <div className={propertiesContainer}>
        <Properties
          properties={properties}
          pcName={pcName}
        />
      </div>
    </Suspense>
  )
})
