import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { PCO } from './PCO/index.jsx'
import storeContext from '../../../../../storeContext.js'
import { Spinner } from '../../../../shared/Spinner.jsx'

const SpinnerContainer = styled.div`
  padding-top: 15px;
`

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

export const PcoList = observer(() => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <SpinnerContainer>
        <Spinner message="" />
      </SpinnerContainer>
    )
  }

  return nodes.map(({ name, count }) => (
    <PCO
      key={name}
      pcName={name}
      count={count}
    />
  ))
})
