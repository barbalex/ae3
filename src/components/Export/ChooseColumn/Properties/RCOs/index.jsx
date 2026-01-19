import { useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { RcList } from './RcList/index.jsx'
import { storeContext } from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'

import {
  container,
  card,
  cardActions,
  cardActionTitle,
  count,
} from './index.module.css'

const query = gql`
  query exportRcoCountQuery($exportTaxonomies: [String!]) {
    exportRcoCount(exportTaxonomies: $exportTaxonomies) {
      propertyCount
      pcReltypeCount
    }
  }
`

export const RCOs = observer(({ rcoExpanded, onToggleRco }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()
  const apolloClient = useApolloClient()

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ['exportRcoCount', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query: query,
        variables: {
          exportTaxonomies,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const pcCount = data?.data?.exportRcoCount?.pcReltypeCount ?? 0
  const propertyCount = data?.data?.exportRcoCount?.propertyCount ?? 0

  if (error) return `Error fetching data: ${error.message}`

  return (
    <ErrorBoundary>
      <div className={container}>
        <Card className={card}>
          <CardActions
            disableSpacing
            onClick={onToggleRco}
            className={cardActions}
          >
            <div className={cardActionTitle}>
              Beziehungssammlungen
              <span
                className={count}
              >{`(${loading ? '...' : pcCount} Sammlungen, ${
                loading ? '...' : propertyCount
              } ${propertyCount === 1 ? 'Feld' : 'Felder'})`}</span>
            </div>
            <IconButton
              aria-expanded={rcoExpanded}
              aria-label="Show more"
              style={{ transform: rcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={rcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <RcList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
})
