import { useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { RcoList } from './List.jsx'

import {
  container,
  errorContainer,
  card,
  cardActions,
  cardActionTitle,
  count,
} from './index.module.css'

const query = gql`
  query propsByTaxDataQueryForFilterRCOs($exportTaxonomies: [String!]) {
    pc_count: allPropertyCollections(
      filter: {
        relationsByPropertyCollectionId: {
          some: {
            objectByObjectId: {
              taxonomyByTaxonomyId: { name: { in: $exportTaxonomies } }
            }
          }
        }
      }
    ) {
      totalCount
    }
    property_count: rcoPropertiesByTaxonomiesCountFunction(
      exportTaxonomies: $exportTaxonomies
    )
  }
`

export const RCOs = observer(({ rcoExpanded, onToggleRco }) => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, isLoading } = useQuery({
    queryKey: ['exportChooseColumnFilterRcos', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const pcCount = data?.data?.pc_count?.totalCount ?? 0
  const propertyCount = data?.data?.property_count ?? 0

  if (error) {
    return (
      <div className={errorContainer}>
        `Error loading data: ${error.message}`
      </div>
    )
  }

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
              {
                <span className={count}>{`(${
                  isLoading ? '...' : pcCount
                } Sammlungen, ${propertyCount} ${
                  isLoading ? '...'
                  : propertyCount === 1 ? 'Feld'
                  : 'Felder'
                })`}</span>
              }
            </div>
            <IconButton
              aria-expanded={rcoExpanded}
              aria-label="Show more"
              style={{ transform: rcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <Icon>
                <ExpandMoreIcon />
              </Icon>
            </IconButton>
          </CardActions>
          <Collapse
            in={rcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <RcoList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
})
