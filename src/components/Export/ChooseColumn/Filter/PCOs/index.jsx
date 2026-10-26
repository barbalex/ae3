import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PcoList } from './List.jsx'
import { rpc } from '../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './index.module.css'


export const PCOs = ({ pcoExpanded, onTogglePco }) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: ['pcos', exportTaxonomies],
    queryFn: async () => ({
        data: {
          pc_count: { totalCount: (await rpc('pco_properties_by_taxonomies_count_per_pc', { export_taxonomies })).length },
          property_count: await rpc('pco_properties_by_taxonomies_count_function', { export_taxonomies: exportTaxonomies }),
        },
      }),
  })

  const pcCount = data?.data?.pc_count?.totalCount ?? 0
  const propertyCount = data?.data?.property_count ?? 0

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
            onClick={onTogglePco}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>
              Eigenschaftensammlungen
              <span
                className={styles.count}
              >{`(${isLoading ? '...' : pcCount} Sammlungen, ${
                isLoading ? '...' : propertyCount
              } ${propertyCount === 1 ? 'Feld' : 'Felder'})`}</span>
            </div>
            <IconButton
              aria-expanded={pcoExpanded}
              aria-label="Show more"
              style={{ transform: pcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={pcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <PcoList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
