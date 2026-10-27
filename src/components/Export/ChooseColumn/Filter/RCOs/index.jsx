import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { rpc } from '../../../../../modules/api.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { RcoList } from './List.jsx'
import { exportTaxonomiesAtom } from '../../../../../store/index.ts'

import styles from './index.module.css'


export const RCOs = ({ rcoExpanded, onToggleRco }) => {

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, error, isLoading } = useQuery({
    queryKey: ['exportChooseColumnFilterRcos', exportTaxonomies],
    queryFn: async () => ({
        data: {
          pc_count: { totalCount: [...new Set((await rpc('rco_properties_by_taxonomies_function', { taxonomy_names: exportTaxonomies })).map((r) => r.property_collection_name))].length },
          property_count: await rpc('rco_properties_by_taxonomies_count_function', { export_taxonomies: exportTaxonomies }),
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
            onClick={onToggleRco}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>
              Beziehungssammlungen
              {
                <span className={styles.count}>{`(${
                  isLoading ? '...' : pcCount
                } Sammlungen, ${propertyCount} ${
                  isLoading ? '...'
                  : propertyCount === 1 ? 'Feld'
                  : 'Felder'
                })`}</span>
              }
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
            <RcoList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
