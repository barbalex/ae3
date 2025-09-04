import { useContext } from 'react'
import styled from '@emotion/styled'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import PCO from './PCO/index.jsx'
import storeContext from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'

const ErrorContainer = styled.div`
  padding: 5px;
`
const SpinnerContainer = styled.div`
  padding-top: 15px;
`

const query = gql`
  query propsByTaxDataQueryForFilterPCOs($exportTaxonomies: [String!]) {
    pcoPropertiesByTaxonomiesCountPerPc(exportTaxonomies: $exportTaxonomies) {
      nodes {
        name
        count
      }
    }
  }
`

const PcosCardList = () => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, isLoading } = useQuery({
    queryKey: ['filterPcosList', exportTaxonomies],
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

  if (error) {
    return (
      <ErrorContainer>`Error loading data: ${error.message}`</ErrorContainer>
    )
  }

  if (isLoading) {
    return (
      <SpinnerContainer>
        <Spinner message="" />
      </SpinnerContainer>
    )
  }

  return (
    <ErrorBoundary>
      {nodes.map(({ name, count }) => (
        <PCO
          key={name}
          pc={name}
          count={count}
        />
      ))}
    </ErrorBoundary>
  )
}

export default observer(PcosCardList)
