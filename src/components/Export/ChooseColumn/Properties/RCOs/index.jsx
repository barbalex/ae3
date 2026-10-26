import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RcList } from './RcList/index.jsx'
import { rpc } from '../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './index.module.css'


export const RCOs = ({ rcoExpanded, onToggleRco }) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ['exportRcoCount', exportTaxonomies],
    queryFn: async () => {
      const r = await rpc('export_rco_count', {
        export_taxonomies: exportTaxonomies,
      })
      return {
        data: {
          exportRcoCount: {
            propertyCount: r.property_count,
            pcReltypeCount: r.pc_reltype_count,
          },
        },
      }
    },
  })

  const pcCount = data?.data?.exportRcoCount?.pcReltypeCount ?? 0
  const propertyCount = data?.data?.exportRcoCount?.propertyCount ?? 0

  if (error) return `Error fetching data: ${error.message}`

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Card className={styles.card}>
          <CardActions
            disableSpacing
            onClick={onToggleRco}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>
              Beziehungssammlungen
              <span
                className={styles.count}
              >{`(${loading ? '...' : pcCount} Sammlungen, ${
                loading ? '...' : propertyCount
              } ${propertyCount === 1 ? 'Feld' : 'Felder'})`}</span>
            </div>
            <IconButton
              aria-expanded={rcoExpanded}
              aria-label="Show more"
              style={{ transform: rcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={rcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <RcList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
