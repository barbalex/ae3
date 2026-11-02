import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Taxonomy } from './Taxonomy'
import { JointTaxonomy } from './JointTaxonomy'
import { rpc } from '../../../../../modules/api'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary'
import { joinTaxProperties } from './joinTaxProperties'
import { exportTaxonomiesAtom } from '../../../../../store'

import styles from './index.module.css'


type TaxonomiesProps = {
  taxonomiesExpanded: boolean
  onToggleTaxonomies: () => void
}

export const Taxonomies = ({
  taxonomiesExpanded,
  onToggleTaxonomies,
}: TaxonomiesProps) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error, isLoading: loading } = useQuery({
    queryKey: ['exportChooseColumnFilterTaxonomiesCard', exportTaxonomies],
    queryFn: async () => ({
        data: { taxPropertiesByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('tax_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r: any) => ({taxonomyName: r.taxonomy_name, propertyName: r.property_name, jsontype: r.jsontype, count: r.count})) } },
      }),
  })
  const taxProperties =
    data?.data?.taxPropertiesByTaxonomiesFunction?.nodes ?? []

  const taxPropertiesByTaxonomy = groupBy(taxProperties, (p: any) => p.taxonomyName)
  const taxPropertiesFields = groupBy(taxProperties, (p: any) => p.propertyName)
  const taxCount = Object.keys(taxPropertiesByTaxonomy).length
  const taxFieldsCount = Object.keys(taxPropertiesFields).length
  const initiallyExpanded = Object.keys(taxPropertiesByTaxonomy).length === 1

  const jointTaxProperties = joinTaxProperties({
    taxCount,
    taxProperties,
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
      <div className={styles.container}>
        <Card className={styles.card}>
          <CardActions
            disableSpacing
            onClick={onToggleTaxonomies}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>
              Taxonomien
              <span className={styles.count}>{`(${loading ? '...' : taxCount} ${
                taxCount === 1 ? 'Taxonomie' : 'Taxonomien'
              }, ${loading ? '...' : taxFieldsCount} ${
                taxFieldsCount === 1 ? 'Feld' : 'Felder'
              })`}</span>
            </div>
            <IconButton
              aria-expanded={taxonomiesExpanded}
              aria-label="Show more"
              style={{
                transform: taxonomiesExpanded ? 'rotate(180deg)' : 'none',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={taxonomiesExpanded}
            timeout="auto"
            unmountOnExit
          >
            {jointTaxProperties.length > 0 && (
              <JointTaxonomy jointTaxProperties={jointTaxProperties} />
            )}
            {Object.keys(taxPropertiesByTaxonomy).map((pc) => (
              <Taxonomy
                pc={pc}
                key={pc}
                initiallyExpanded={initiallyExpanded}
              />
            ))}
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
