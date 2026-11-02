import { useState } from 'react'

import { HowTo } from './HowTo'
import { Taxonomies } from './Taxonomies'
import { PcoList } from './PCOs'
import { RCOs } from './RCOs'
import { ErrorBoundary } from '../../../shared/ErrorBoundary'

import styles from './index.module.css'

export const Properties = () => {
  const [taxonomiesExpanded, setTaxonomiesExpanded] = useState(false)
  const [pcoExpanded, setFilterExpanded] = useState(false)
  const [rcoExpanded, setPropertiesExpanded] = useState(false)

  const onToggleTaxonomies = () => {
    setTaxonomiesExpanded(!taxonomiesExpanded)
    // TODO (later)
    // check if only one Taxonomy
    // if so: open it

    // close all others
    setFilterExpanded(false)
    setPropertiesExpanded(false)
  }

  const onTogglePco = () => {
    if (!pcoExpanded) {
      setFilterExpanded(true)
      // close all others
      setTaxonomiesExpanded(false)
      setPropertiesExpanded(false)
    } else {
      setFilterExpanded(false)
    }
  }

  const onToggleRco = () => {
    if (!rcoExpanded) {
      setPropertiesExpanded(true)
      // close all others
      setTaxonomiesExpanded(false)
      setFilterExpanded(false)
    } else {
      setPropertiesExpanded(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <HowTo />
        <Taxonomies
          taxonomiesExpanded={taxonomiesExpanded}
          onToggleTaxonomies={onToggleTaxonomies}
        />
        <PcoList
          pcoExpanded={pcoExpanded}
          onTogglePco={onTogglePco}
        />
        <RCOs
          rcoExpanded={rcoExpanded}
          onToggleRco={onToggleRco}
        />
      </div>
    </ErrorBoundary>
  )
}
