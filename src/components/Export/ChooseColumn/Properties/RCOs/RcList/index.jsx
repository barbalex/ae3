import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { RCO } from './RCO/index.jsx'
import storeContext from '../../../../../../storeContext.js'
import { Spinner } from '../../../../../shared/Spinner.jsx'

const SpinnerContainer = styled.div`
  padding-top: 15px;
`

const propsByTaxQuery = gql`
  query exportRcoListQuery($exportTaxonomies: [String]) {
    exportRcoList(exportTaxonomies: $exportTaxonomies) {
      nodes {
        pcname
        relationtype
        count
      }
    }
  }
`

export const RcList = observer(() => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, loading } = useQuery(propsByTaxQuery, {
    variables: {
      exportTaxonomies,
      queryExportTaxonomies: exportTaxonomies.length > 0,
    },
  })

  const nodes = data?.exportRcoList?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  if (loading) {
    return (
      <SpinnerContainer>
        <Spinner message="" />
      </SpinnerContainer>
    )
  }

  return nodes.map(({ pcname, relationtype, count }) => (
    <RCO
      key={`${pcname}/${relationtype}}`}
      pcname={pcname}
      relationtype={relationtype}
      count={count}
    />
  ))
})
