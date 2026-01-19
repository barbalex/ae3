import { useState, useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { AllChooser } from './AllChooser.jsx'
import { Properties } from '../Properties.jsx'
import { storeContext } from '../../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'

import {
  card,
  cardActions,
  cardActionTitle,
  cardContent,
  propertiesContainer,
  count,
} from './index.module.css'

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForPropertiesTaxonomy(
    $queryExportTaxonomies: Boolean!
    $exportTaxonomies: [String]
  ) {
    taxPropertiesOnlyByTaxonomiesFunction(taxonomyNames: $exportTaxonomies)
      @include(if: $queryExportTaxonomies) {
      nodes {
        taxonomyName
        propertyName
        count
      }
    }
  }
`

export const Taxonomy = observer(({ initiallyExpanded, tax }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()
  const apolloClient = useApolloClient()

  const { data: propsByTaxData, error: propsByTaxError } = useQuery({
    queryKey: ['taxPropertiesOnlyByTaxonomies', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query: propsByTaxQuery,
        variables: {
          exportTaxonomies,
          queryExportTaxonomies: exportTaxonomies.length > 0,
        },
      }),
  })

  const [expanded, setExpanded] = useState(initiallyExpanded)
  const onClickActions = () => setExpanded(!expanded)

  const taxProperties =
    propsByTaxData?.data?.taxPropertiesOnlyByTaxonomiesFunction?.nodes ?? []
  const taxPropertiesByTaxonomy = groupBy(taxProperties, (p) => p.taxonomyName)

  if (propsByTaxError) return `Error fetching data: ${propsByTaxError.message}`

  if (propsByTaxData === undefined) return <Spinner />

  const properties = taxPropertiesByTaxonomy[tax]

  return (
    <ErrorBoundary>
      <Card className={card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={cardActions}
        >
          <div className={cardActionTitle}>
            {tax}
            <span className={count}>{`(${properties.length} ${
              properties.length === 1 ? 'Feld' : 'Felder'
            })`}</span>
            <IconButton
              aria-expanded={expanded}
              aria-label="Show more"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <CardContent className={cardContent}>
            {properties.length > 1 && <AllChooser properties={properties} />}
            <div className={propertiesContainer}>
              <Properties properties={properties} />
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
})
