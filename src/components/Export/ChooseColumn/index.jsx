import { useState, useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import Snackbar from '@mui/material/Snackbar'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import { Taxonomies } from './Taxonomies/index.jsx'
import { Properties } from './Properties/index.jsx'
import { Filter } from './Filter/index.jsx'
import { storeContext } from '../../../storeContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import {
  snackbar,
  card,
  cardActions,
  cardActionTitle,
  container,
} from './index.module.css'

export const ChooseColumn = observer(() => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const [taxonomiesExpanded, setTaxonomiesExpanded] = useState(true)
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [propertiesExpanded, setPropertiesExpanded] = useState(false)
  const [message, setMessage] = useState('')

  const onSetMessage = (message) => {
    setMessage(message)
    if (message) {
      setTimeout(() => setMessage(''), 5000)
    }
  }
  const onToggleTaxonomies = () => {
    setTaxonomiesExpanded(!taxonomiesExpanded)
    // close all others
    setFilterExpanded(false)
    setPropertiesExpanded(false)
  }
  const onToggleFilter = () => {
    if (!filterExpanded && exportTaxonomies.length > 0) {
      setFilterExpanded(true)
      // close all others
      setTaxonomiesExpanded(false)
      setPropertiesExpanded(false)
    } else {
      setFilterExpanded(false)
      onSetMessage('Bitte wählen Sie mindestens eine Taxonomie')
    }
  }
  const onToggleProperties = () => {
    if (!propertiesExpanded && exportTaxonomies.length > 0) {
      setPropertiesExpanded(true)
      // close all others
      setTaxonomiesExpanded(false)
      setFilterExpanded(false)
    } else {
      setPropertiesExpanded(false)
      onSetMessage('Bitte wählen Sie mindestens eine Gruppe')
    }
  }

  return (
    <ErrorBoundary>
      <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
        <div className={container}>
          <Card className={card}>
            <CardActions
              className={cardActions}
              disableSpacing
              onClick={onToggleTaxonomies}
            >
              <div className={cardActionTitle}>1. Taxonomie(n) wählen</div>
              <IconButton
                aria-expanded={taxonomiesExpanded}
                aria-label="Show more"
                style={{
                  transform: taxonomiesExpanded ? 'rotate(180deg)' : 'none',
                }}
              >
                <Icon>
                  <ExpandMoreIcon />
                </Icon>
              </IconButton>
            </CardActions>
            <Collapse
              in={taxonomiesExpanded}
              timeout="auto"
              unmountOnExit
            >
              <Taxonomies />
            </Collapse>
          </Card>
          <Card className={card}>
            <CardActions
              className={cardActions}
              disableSpacing
              onClick={onToggleFilter}
            >
              <div className={cardActionTitle}>2. filtern</div>
              <IconButton
                aria-expanded={filterExpanded}
                aria-label="Show more"
                style={{
                  transform: filterExpanded ? 'rotate(180deg)' : 'none',
                }}
              >
                <Icon>
                  <ExpandMoreIcon />
                </Icon>
              </IconButton>
            </CardActions>
            <Collapse
              in={filterExpanded}
              timeout="auto"
              unmountOnExit
            >
              <Filter />
            </Collapse>
          </Card>
          <Card className={card}>
            <CardActions
              className={cardActions}
              disableSpacing
              onClick={onToggleProperties}
            >
              <div className={cardActionTitle}>3. Eigenschaften wählen</div>
              <IconButton
                aria-expanded={propertiesExpanded}
                aria-label="Show more"
                style={{
                  transform: propertiesExpanded ? 'rotate(180deg)' : 'none',
                }}
              >
                <Icon>
                  <ExpandMoreIcon />
                </Icon>
              </IconButton>
            </CardActions>
            <Collapse
              in={propertiesExpanded}
              timeout="auto"
              unmountOnExit
            >
              <Properties />
            </Collapse>
          </Card>
          <Snackbar
            open={!!message}
            message={message}
            className={snackbar}
          />
        </div>
      </SimpleBar>
    </ErrorBoundary>
  )
})
