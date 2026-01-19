import { useState, useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Properties } from './Properties.jsx'
import { storeContext } from '../../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'

import {
  errorContainer,
  card,
  cardActions,
  cardActionTitle,
  count,
  propertiesContainer,
} from './index.module.css'

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForFilterRCO(
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

export const RCO = observer(({ pc }) => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnFilterRcosRco', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query: propsByTaxQuery,
        variables: {
          exportTaxonomies,
          queryExportTaxonomies: exportTaxonomies.length > 0,
        },
      }),
  })

  const [expanded, setExpanded] = useState(false)
  const onClickActions = () => setExpanded(!expanded)

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
      <div className={errorContainer}>
        `Error loading data: ${error.message}`
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Card className={card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={cardActions}
        >
          <div className={cardActionTitle}>
            {pc}
            <span
              className={count}
            >{`(${rcoPropertiesByPropertyCollection?.[pc]?.length} ${
              rcoPropertiesByPropertyCollection?.[pc]?.length === 1 ?
                'Feld'
              : 'Felder'
            })`}</span>
          </div>
          <IconButton
            aria-expanded={expanded}
            aria-label="Show more"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <div className={propertiesContainer}>
            <Properties properties={rcoPropertiesByPropertyCollection[pc]} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
})
