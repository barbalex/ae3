import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { AllChooser } from './AllChooser'
import { Properties } from '../Properties'
import { rpc } from '../../../../../../modules/api'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary'
import { Spinner } from '../../../../../shared/Spinner'
import { exportTaxonomiesAtom } from '../../../../../../store'

import styles from './index.module.css'


type TaxonomyProps = {
  initiallyExpanded: boolean
  tax: string
}

export const Taxonomy = ({ initiallyExpanded, tax }: TaxonomyProps) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data: propsByTaxData, error: propsByTaxError } = useQuery({
    queryKey: ['taxPropertiesOnlyByTaxonomies', exportTaxonomies],
    queryFn: async () => ({
        data: { taxPropertiesOnlyByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('tax_properties_only_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r: any) => ({taxonomyName: r.taxonomy_name, propertyName: r.property_name, count: r.count})) } },
      }),
  })

  const [expanded, setExpanded] = useState(initiallyExpanded)
  const onClickActions = () => setExpanded(!expanded)

  const taxProperties =
    propsByTaxData?.data?.taxPropertiesOnlyByTaxonomiesFunction?.nodes ?? []
  const taxPropertiesByTaxonomy = groupBy(taxProperties, (p: any) => p.taxonomyName)

  if (propsByTaxError) return `Error fetching data: ${propsByTaxError.message}`

  if (propsByTaxData === undefined) return <Spinner />

  const properties = taxPropertiesByTaxonomy[tax]

  return (
    <ErrorBoundary>
      <Card className={styles.card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={styles.cardActions}
        >
          <div className={styles.cardActionTitle}>
            {tax}
            <span className={styles.count}>{`(${properties.length} ${
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
          <CardContent className={styles.cardContent}>
            {properties.length > 1 && <AllChooser properties={properties} />}
            <div className={styles.propertiesContainer}>
              <Properties properties={properties} />
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
