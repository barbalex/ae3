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

import { PcoList as List } from './PCOs.jsx'
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
  query propsByTaxDataQueryForFilterRCOs($exportTaxonomies: [String!]) {
    pc_count: allPropertyCollections(
      filter: {
        propertyCollectionObjectsByPropertyCollectionId: {
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
    property_count: pcoPropertiesByTaxonomiesCountFunction(
      exportTaxonomies: $exportTaxonomies
    )
  }
`

export const PcoList = observer(({ pcoExpanded, onTogglePco }) => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error, isLoading } = useQuery({
    queryKey: ['exportChooseColumnPropertiesPcosList', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
        },
      }),
  })

  const pcCount = data?.data?.pc_count?.totalCount ?? 0
  const propertyCount = data?.data?.property_count ?? 0

  if (error) return `Error fetching data: ${error.message}`

  return (
    <ErrorBoundary>
      <div className={container}>
        <Card className={card}>
          <CardActions
            disableSpacing
            onClick={onTogglePco}
            className={cardActions}
          >
            <div className={cardActionTitle}>
              Eigenschaftensammlungen
              <span
                className={count}
              >{`(${isLoading ? '...' : pcCount} Sammlungen, ${
                isLoading ? '...' : propertyCount
              } ${propertyCount === 1 ? 'Feld' : 'Felder'})`}</span>
            </div>
            <IconButton
              aria-expanded={pcoExpanded}
              aria-label="Show more"
              style={{ transform: pcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={pcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <List />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
})
