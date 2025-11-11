import { useContext, Suspense } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'

import { RCO } from './RCO/index.jsx'
import { storeContext } from '../../../../../../storeContext.js'
import { Spinner } from '../../../../../shared/Spinner.jsx'

import { spinnerContainer } from './index.module.css'

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

const fallback = (
  <div className={spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RcList = observer(() => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery(propsByTaxQuery, {
    variables: {
      exportTaxonomies,
      queryExportTaxonomies: exportTaxonomies.length > 0,
    },
  })

  const nodes = data?.exportRcoList?.nodes ?? []

  if (error) return `Error fetching data: ${error.message}`

  return (
    <Suspense fallback={fallback}>
      {nodes.map(({ pcname, relationtype, count }) => (
        <RCO
          key={`${pcname}/${relationtype}}`}
          pcname={pcname}
          relationtype={relationtype}
          count={count}
        />
      ))}
    </Suspense>
  )
})
