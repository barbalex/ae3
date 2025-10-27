import { useContext, Suspense } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { storeContext } from '../../../../../../../storeContext.js'
import { AllChooser } from './AllChooser.jsx'
import { Properties } from './Properties.jsx'
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

const fallback = (
  <SpinnerContainer>
    <Spinner message="" />
  </SpinnerContainer>
)

export const Chooser = observer(({ pcName, count }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery(query, {
    variables: {
      exportTaxonomies,
      pcName,
    },
  })

  const properties = data?.pcoPropertiesByTaxonomiesAndPc?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  return (
    <Suspense fallback={fallback}>
      {count > 1 && (
        <AllChooser
          properties={properties}
          pcName={pcName}
        />
      )}
      <PropertiesContainer>
        <Properties
          properties={properties}
          pcName={pcName}
        />
      </PropertiesContainer>
    </Suspense>
  )
})
