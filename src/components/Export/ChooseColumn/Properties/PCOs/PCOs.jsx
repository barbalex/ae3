import { useContext, Suspense } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { PCO } from './PCO/index.jsx'
import { storeContext } from '../../../../../storeContext.js'
import { Spinner } from '../../../../shared/Spinner.jsx'

import { spinnerContainer } from './PCOs.module.css'

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
  <div className={spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const PcoList = observer(() => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnPropertiesPcos', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
        },
        fetchPolicy: 'no-cache',
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
})
