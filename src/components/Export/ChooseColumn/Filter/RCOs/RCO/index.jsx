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
import { rpc } from '../../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../../store/index.ts'

import styles from './index.module.css'


export const RCO = ({ pc }) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnFilterRcosRco', exportTaxonomies],
    queryFn: async () => ({
        data: { rcoPropertiesByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('rco_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r) => ({propertyCollectionName: r.property_collection_name, relationType: r.relation_type, propertyName: r.property_name, jsontype: r.jsontype, count: r.count})) } },
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
          onClick={onClickActions}
          className={styles.cardActions}
        >
          <div className={styles.cardActionTitle}>
            {pc}
            <span
              className={styles.count}
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
          <div className={styles.propertiesContainer}>
            <Properties properties={rcoPropertiesByPropertyCollection[pc]} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
