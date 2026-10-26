import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Properties } from './Properties.jsx'
import { rpc } from '../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './Taxonomy.module.css'


export const Taxonomy = ({ pc, initiallyExpanded }) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: [
      'exportChooseColumnFilterTaxonomiesTaxonomyCard',
      exportTaxonomies,
    ],
    queryFn: async () => ({
        data: { taxPropertiesByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('tax_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r) => ({taxonomyName: r.taxonomy_name, propertyName: r.property_name, jsontype: r.jsontype, count: r.count})) } },
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
