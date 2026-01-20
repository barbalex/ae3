import { useContext } from 'react'
import Paper from '@mui/material/Paper'
import { observer } from 'mobx-react-lite'

import { HowTo } from './HowTo.jsx'
import { ExportTypes } from './ExportTypes/index.jsx'
import { storeContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

export const Taxonomies = observer(() => {
  const store = useContext(storeContext)
  const { type: exportType } = store.export
  const exportTaxonomies = store.export.taxonomies.toJSON()

  let paperBackgroundColor = '#1565C0'
  let textProperties = 'Wählen Sie eine oder mehrere Taxonomien.'
  if (!exportType) {
    textProperties = 'Wählen Sie Arten oder Lebensräume.'
  }
  if (exportTaxonomies.length > 0) {
    paperBackgroundColor = '#2E7D32'
    textProperties = 'Die Eigenschaften wurden geladen.'
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <HowTo />
        <ExportTypes />
        <Paper
          elevation={1}
          style={{ backgroundColor: paperBackgroundColor }}
          className={styles.paper}
        >
          <div className={styles.paperTextContainer}>
            <div className={styles.propertyText}>{textProperties}</div>
          </div>
        </Paper>
      </div>
    </ErrorBoundary>
  )
})
