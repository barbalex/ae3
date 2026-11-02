import { useAtomValue } from 'jotai'

import { OptionsChosen } from './OptionsChosen/index'
import { Preview } from './Preview'
import { exportTaxonomiesAtom } from '../../../store'
import { ErrorBoundary } from '../../shared/ErrorBoundary'

import styles from './index.module.css'

export const PreviewColumn = () => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  return (
    <ErrorBoundary>
      <div style={{ maxHeight: '100%', height: '100%', overflow: 'auto' }}>
        <div className={styles.container}>
          <OptionsChosen />
          <Preview />
          {exportTaxonomies.length === 0 && (
            <div className={styles.howTo}>
              Sobald eine Taxonomie gewählt ist, werden hier Daten angezeigt.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
