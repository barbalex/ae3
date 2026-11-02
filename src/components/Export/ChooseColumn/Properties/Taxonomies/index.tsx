import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy, sumBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TaxonomiesList } from './TaxonomiesList'
import { JointTaxonomy } from './JointTaxonomy'
import { rpc } from '../../../../../modules/api'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary'
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

  const { data: propsByTaxData, error: propsByTaxError } = useQuery({
    queryKey: ['taxPropertiesByTaxonomies', exportTaxonomies],
    queryFn: async () => ({
        data: { taxPropertiesByTaxonomiesFunction: { nodes: exportTaxonomies.length === 0 ? [] : (await rpc('tax_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r: any) => ({taxonomyName: r.taxonomy_name, propertyName: r.property_name, jsontype: r.jsontype, count: r.count})) } },
      }),
  })

  const taxProperties =
    propsByTaxData?.data?.taxPropertiesByTaxonomiesFunction?.nodes ?? []

  const taxPropertiesByTaxonomy = groupBy(taxProperties, (p: any) => p.taxonomyName)
  const taxPropertiesFields = groupBy(taxProperties, (p: any) => p.propertyName)
  const taxonomies = Object.keys(taxPropertiesByTaxonomy)
  const taxCount = taxonomies.length
  const taxFieldsCount = Object.keys(taxPropertiesFields).length
  let jointTaxProperties: any[] = []
  if (taxCount > 1) {
    jointTaxProperties = Object.values(
      groupBy(taxProperties, (t: any) => `${t.propertyName}/${t.jsontype}`),
    )
      .filter((v) => v.length === taxCount)
      .map((t: any[]) => ({
        count: sumBy(t, (x) => Number(x.count)),
        jsontype: t[0].jsontype,
        propertyName: t[0].propertyName,
        taxonomies: t.map((x) => x.taxonomyName),
        taxname: 'Taxonomie',
      }))
  }
  const initiallyExpanded = taxonomies.length === 1

  if (propsByTaxError) return `Error fetching data: ${propsByTaxError.message}`

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
              {taxCount > 0 && (
                <span className={styles.count}>{`(${taxCount} ${
                  taxCount === 1 ? 'Taxonomie' : 'Taxonomien'
                }, ${taxFieldsCount} ${
                  taxFieldsCount === 1 ? 'Feld' : 'Felder'
                })`}</span>
              )}
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
            <TaxonomiesList
              taxonomies={taxonomies}
              initiallyExpanded={initiallyExpanded}
            />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
