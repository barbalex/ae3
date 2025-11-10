import { useContext, Suspense } from 'react'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { RCO } from './RCO/index.jsx'
import { storeContext } from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'

import { errorContainer, spinnerContainer } from './List.module.css'

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForFilterRCOs(
    $queryExportTaxonomies: Boolean!
    $exportTaxonomies: [String]
  ) {
    rcoPropertiesByTaxonomiesFunction(taxonomyNames: $exportTaxonomies)
      @include(if: $queryExportTaxonomies) {
      nodes {
        propertyCollectionName
        relationType
        propertyName
        jsontype
        count
      }
    }
  }
`

const fallback = (
  <div className={spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RcoList = observer(() => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnFilterRcoList', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query: propsByTaxQuery,
        variables: {
          exportTaxonomies,
          queryExportTaxonomies: exportTaxonomies.length > 0,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const rcoProperties =
    data?.data?.rcoPropertiesByTaxonomiesFunction?.nodes ?? []

  const rcoPropertiesByPropertyCollection = groupBy(rcoProperties, (x) => {
    if (x.propertyCollectionName.includes(x.relationType)) {
      return x.propertyCollectionName
    }
    return `${x.propertyCollectionName}: ${x.relationType}`
  })

  if (error) {
    return (
      <div className={errorContainer}>
        `Error loading data: ${error.message}`
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {Object.keys(rcoPropertiesByPropertyCollection).map((pc) => (
          <RCO
            key={pc}
            pc={pc}
          />
        ))}
      </Suspense>
    </ErrorBoundary>
  )
})
