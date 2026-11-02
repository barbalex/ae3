import { useState } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { HowTo } from './HowTo'
import { Tipps } from './Tipps'
import { Id } from './Id'
import { Taxonomies } from './Taxonomies'
import { PCOs } from './PCOs'
import { RCOs } from './RCOs'
import { ErrorBoundary } from '../../../shared/ErrorBoundary'
import {
  exportWithSynonymDataAtom,
  exportAddFilterFieldsAtom,
} from '../../../../store'

import styles from './index.module.css'

export const Filter = () => {
  const [withSynonymData, setWithSynonymData] = useAtom(
    exportWithSynonymDataAtom,
  )
  const [addFilterFields, setAddFilterFields] = useAtom(
    exportAddFilterFieldsAtom,
  )

  const [taxonomiesExpanded, setTaxonomiesExpanded] = useState(false)
  const [pcoExpanded, setFilterExpanded] = useState(false)
  const [rcoExpanded, setPropertiesExpanded] = useState(false)

  const onToggleTaxonomies = () => {
    setTaxonomiesExpanded(!taxonomiesExpanded)
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
        <Tipps />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={withSynonymData}
                onChange={(event, checked) => setWithSynonymData(checked)}
              />
            }
            label="Informationen von Synonymen mit exportieren"
            className={styles.label}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={addFilterFields}
                onChange={(event, checked) => setAddFilterFields(checked)}
              />
            }
            label="Gefilterte Felder immer exportieren"
            className={styles.label}
          />
        </FormGroup>
        <Id />
        <Taxonomies
          taxonomiesExpanded={taxonomiesExpanded}
          onToggleTaxonomies={onToggleTaxonomies}
        />
        <PCOs
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
