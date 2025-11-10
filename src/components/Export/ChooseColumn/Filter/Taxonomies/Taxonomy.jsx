import { useState, useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Properties } from './Properties.jsx'
import { storeContext } from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'

import {
  card,
  errorContainer,
  cardActions,
  cardActionTitle,
  count,
  propertiesContainer,
} from './Taxonomy.module.css'

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForFilterTaxonomy(
    $queryExportTaxonomies: Boolean!
    $exportTaxonomies: [String]
  ) {
    taxPropertiesByTaxonomiesFunction(taxonomyNames: $exportTaxonomies)
      @include(if: $queryExportTaxonomies) {
      nodes {
        taxonomyName
        propertyName
        jsontype
        count
      }
    }
  }
`

export const Taxonomy = observer(({ pc, initiallyExpanded }) => {
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery({
    queryKey: [
      'exportChooseColumnFilterTaxonomiesTaxonomyCard',
      exportTaxonomies,
    ],
    queryFn: () =>
      apolloClient.query({
        query: propsByTaxQuery,
        variables: {
          exportTaxonomies,
          queryExportTaxonomies: exportTaxonomies.length > 0,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const taxProperties =
    data?.data?.taxPropertiesByTaxonomiesFunction?.nodes ?? []

  // eliminate null values
  const taxPropertiesWithoutNullTypes = taxProperties.filter(
    (p) => p.jsontype !== 'Null',
  )

  const [expanded, setExpanded] = useState(initiallyExpanded)

  const taxPropertiesByTaxonomy = groupBy(
    taxPropertiesWithoutNullTypes,
    (p) => p.taxonomyName,
  )

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
          onClick={() => setExpanded(!expanded)}
          className={cardActions}
        >
          <div className={cardActionTitle}>
            {pc}
            <span
              className={count}
            >{`(${taxPropertiesByTaxonomy?.[pc]?.length} ${
              taxPropertiesByTaxonomy?.[pc]?.length === 1 ? 'Feld' : 'Felder'
            })`}</span>
          </div>
          <IconButton
            aria-expanded={expanded}
            aria-label="Show more"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            <Icon>
              <ExpandMoreIcon />
            </Icon>
          </IconButton>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <div className={propertiesContainer}>
            <Properties properties={taxPropertiesByTaxonomy?.[pc] ?? []} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
})
