import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import storeContext from '../../../../../../../storeContext.js'
import AllChooser from './AllChooser.jsx'
import Properties from './Properties.jsx'
import { Spinner } from '../../../../../../shared/Spinner.jsx'

const PropertiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  container-type: inline-size;
`
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

const ChooserRouter = ({ pcName, count }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, loading } = useQuery(query, {
    variables: {
      exportTaxonomies,
      pcName,
    },
  })

  const properties = data?.pcoPropertiesByTaxonomiesAndPc?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  if (loading) {
    return (
      <SpinnerContainer>
        <Spinner message="" />
      </SpinnerContainer>
    )
  }

  return (
    <>
      {count > 1 && <AllChooser properties={properties} pcName={pcName} />}
      <PropertiesContainer>
        <Properties properties={properties} pcName={pcName} />
      </PropertiesContainer>
    </>
  )
}

export default observer(ChooserRouter)
