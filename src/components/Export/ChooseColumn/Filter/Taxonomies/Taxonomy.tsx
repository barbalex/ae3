import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Properties } from './Properties'
import { rpc } from '../../../../../modules/api'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary'
import { exportTaxonomiesAtom } from '../../../../../store'

import styles from './Taxonomy.module.css'


type TaxonomyProps = {
  pc: string
  initiallyExpanded: boolean
}

export const Taxonomy = ({ pc, initiallyExpanded }: TaxonomyProps) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: [
      'exportChooseColumnFilterTaxonomiesTaxonomyCard',
      exportTaxonomies,
    ],
    queryFn: async () => ({
        data: { taxPropertiesByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('tax_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r: any) => ({taxonomyName: r.taxonomy_name, propertyName: r.property_name, jsontype: r.jsontype, count: r.count})) } },
      }),
  })
  const taxProperties =
    data?.data?.taxPropertiesByTaxonomiesFunction?.nodes ?? []

  // eliminate null values
  const taxPropertiesWithoutNullTypes = taxProperties.filter(
    (p: any) => p.jsontype !== 'Null',
  )

  const [expanded, setExpanded] = useState(initiallyExpanded)

  const taxPropertiesByTaxonomy = groupBy(
    taxPropertiesWithoutNullTypes,
    (p: any) => p.taxonomyName,
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
