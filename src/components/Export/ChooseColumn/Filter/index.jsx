import { useState, useContext } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { HowTo } from './HowTo.jsx'
import { Tipps } from './Tipps.jsx'
import { Id } from './Id.jsx'
import { Taxonomies } from './Taxonomies/index.jsx'
import { PCOs } from './PCOs/index.jsx'
import { RCOs } from './RCOs/index.jsx'
import { storeContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

import { container, label } from './index.module.css'

export const Filter = observer(() => {
  const store = useContext(storeContext)
  const {
    setWithSynonymData,
    withSynonymData,
    addFilterFields,
    setAddFilterFields,
  } = store.export

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
      <div className={container}>
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
            className={label}
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
            className={label}
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
})
