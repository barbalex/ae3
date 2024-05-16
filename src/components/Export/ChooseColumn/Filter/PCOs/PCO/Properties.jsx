import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import Property from './Property'
import storeContext from '../../../../../../storeContext'
import Spinner from '../../../../../shared/Spinner.jsx'

const SpinnerContainer = styled.div`
  padding-top: 15px;
  width: 100%;
`

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

const Properties = ({ pc }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, isLoading } = useQuery({
    queryKey: ['exportFilterPcos', exportTaxonomies, pc],
    queryFn: () =>
      client.query({
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

  if (isLoading) {
    return (
      <SpinnerContainer>
        <Spinner message="" />
      </SpinnerContainer>
    )
  }

  return properties.map((p) => (
    <Property
      key={`${p.property}${p.type}`}
      pcname={pc}
      pname={p.property}
      jsontype={p.type}
    />
  ))
}

export default observer(Properties)
