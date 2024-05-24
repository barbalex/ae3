import React, { useContext } from 'react'
import styled from '@emotion/styled'
import groupBy from 'lodash/groupBy'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import RCO from './RCO/index.jsx'
import storeContext from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'

const ErrorContainer = styled.div`
  padding: 5px;
`
const SpinnerContainer = styled.div`
  padding-top: 15px;
`

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

const RcosCardList = () => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, isLoading } = useQuery({
    queryKey: ['exportChooseColumnFilterRcoList', exportTaxonomies],
    queryFn: () =>
      client.query({
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
      {Object.keys(rcoPropertiesByPropertyCollection).map((pc) => (
        <RCO key={pc} pc={pc} />
      ))}
    </ErrorBoundary>
  )
}

export default observer(RcosCardList)
