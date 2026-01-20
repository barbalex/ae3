import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import { OptionsChosen } from './OptionsChosen/index.jsx'
import { Preview } from './Preview.jsx'
import { storeContext } from '../../../storeContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

export const PreviewColumn = observer(() => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  return (
    <ErrorBoundary>
      <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
        <div className={styles.container}>
          <OptionsChosen />
          <Preview />
          {exportTaxonomies.length === 0 && (
            <div className={styles.howTo}>
              Sobald eine Taxonomie gewählt ist, werden hier Daten angezeigt.
            </div>
          )}
        </div>
      </SimpleBar>
    </ErrorBoundary>
  )
})
