import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Properties } from './Properties.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './Taxonomy.module.css'

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

export const Taxonomy = ({ pc, initiallyExpanded }) => {
  const apolloClient = useApolloClient()

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

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
      <div className={styles.errorContainer}>
        `Error loading data: ${error.message}`
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Card className={styles.card}>
        <CardActions
          disableSpacing
          onClick={() => setExpanded(!expanded)}
          className={styles.cardActions}
        >
          <div className={styles.cardActionTitle}>
            {pc}
            <span
              className={styles.count}
            >{`(${taxPropertiesByTaxonomy?.[pc]?.length} ${
              taxPropertiesByTaxonomy?.[pc]?.length === 1 ? 'Feld' : 'Felder'
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
          <div className={styles.propertiesContainer}>
            <Properties properties={taxPropertiesByTaxonomy?.[pc] ?? []} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
