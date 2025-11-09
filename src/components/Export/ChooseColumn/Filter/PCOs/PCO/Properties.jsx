import { useContext, Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { PcoProperty } from './Property/index.jsx'
import { storeContext } from '../../../../../../storeContext.js'
import { Spinner } from '../../../../../shared/Spinner.jsx'

import { spinnerContainer } from './Properties.module.css'

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

export const Properties = observer(({ pc }) => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery({
    queryKey: ['exportFilterPcos', exportTaxonomies, pc],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
          pcName: pc,
        },
        fetchPolicy: 'no-cache',
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
})
