import { useState, Suspense } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { AllChooser } from './AllChooser.jsx'
import { Properties } from './Properties.jsx'
import { rpc } from '../../../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../../../shared/Spinner.jsx'
import { exportTaxonomiesAtom } from '../../../../../../../store/index.ts'

import styles from './index.module.css'


const fallback = (
  <div className={styles.spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RCO = ({ pcname, relationtype, count }) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error } = useQuery({
    queryKey: [
      'exportRcoPerRcoRelation',
      exportTaxonomies,
      pcname,
      relationtype,
    ],
    queryFn: async () => ({
        data: { exportRcoPerRcoRelation: { nodes: (await rpc('export_rco_per_rco_relation', { export_taxonomies: exportTaxonomies, pcname, relationtype })) } },
      }),
  })

  // spread to prevent node is not extensible error
  const nodes = [...(data?.data?.exportRcoPerRcoRelation?.nodes ?? [])]
  const bezPartnerNodes = nodes.filter(
    (n) => n.property === 'Beziehungspartner',
  )
  if (bezPartnerNodes.length === 0) {
    nodes.unshift({
      pcname,
      property: 'Beziehungspartner',
      jsontype: 'Boolean',
    })
  }

  const [expanded, setExpanded] = useState(false)

  const onClickActions = () => setExpanded(!expanded)

  if (error) return `Error fetching data: ${error.message}`

  return (
    <ErrorBoundary>
      <Card className={styles.card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={styles.cardActions}
        >
          <div className={styles.cardActionTitle}>
            {`${pcname}: ${relationtype}`}
            <span className={styles.countClass}>{`(${count ?? 0} ${
              count === 1 ? 'Feld' : 'Felder'
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
          className={styles.collapse}
        >
          <Suspense fallback={fallback}>
            {count > 1 && (
              <AllChooser
                properties={nodes}
                relationtype={relationtype}
              />
            )}
            <div className={styles.propertiesContainer}>
              <Properties
                properties={nodes}
                relationtype={relationtype}
              />
            </div>
          </Suspense>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
