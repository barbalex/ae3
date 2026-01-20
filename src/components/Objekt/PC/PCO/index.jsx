import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import {
  MdExpandMore as ExpandMoreIcon,
  MdInfo as InfoIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'
import { sortBy } from 'es-toolkit'

import { PCDescription } from '../../../shared/PCDescription.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { RelationList } from './RelationList/index.jsx'
import { PropertyList } from './PropertyList.jsx'

import styles from './index.module.css'

export const PcPresentation = ({ pC }) => {
  const [expanded, setExpanded] = useState(false)
  const [pCDescriptionExpanded, setPCDescriptionExpanded] = useState(false)

  const pCO = pC?.propertyCollectionObjectsByPropertyCollectionId?.nodes?.[0]
  const relations = pC?.relationsByPropertyCollectionId?.nodes ?? []

  const pcname = pC?.name ?? '(Name fehlt)'
  // never pass null to JSON.parse
  const properties = pCO?.properties ? JSON.parse(pCO.properties) : {}

  // never pass null to object.entries
  let propertiesArray = Object.entries(properties)
  propertiesArray = propertiesArray.filter(
    (o) => o[1] || o[1] === 0 || o[1] === false,
  )
  propertiesArray = sortBy(propertiesArray, [(e) => e[0]]).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, value]) => value || value === 0 || value === false,
  )

  const onClickActions = () => setExpanded(!expanded)
  const iconTitle =
    pCDescriptionExpanded ?
      'Beschreibung der Eigenschaften-Sammlung schliessen'
    : 'Beschreibung der Eigenschaften-Sammlung öffnen'
  const onClickIcon = (event) => {
    event.stopPropagation()
    setPCDescriptionExpanded(!pCDescriptionExpanded)
    setExpanded(true)
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Card className={styles.card}>
          <CardActions
            disableSpacing
            onClick={onClickActions}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>{pcname}</div>
            <div className={styles.cardActionsButtons}>
              <IconButton
                data-expanded={pCDescriptionExpanded}
                aria-expanded={pCDescriptionExpanded}
                aria-label="über diese Eigenschaften-Sammlung"
                title={iconTitle}
                onClick={onClickIcon}
                size="large"
              >
                {!pCDescriptionExpanded && <InfoOutlineIcon />}
                {pCDescriptionExpanded && <InfoIcon />}
              </IconButton>
              <IconButton
                aria-expanded={expanded}
                aria-label="Show more"
                style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </div>
          </CardActions>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <Collapse
              in={pCDescriptionExpanded}
              timeout="auto"
              unmountOnExit
            >
              <PCDescription pC={pC} />
            </Collapse>
            <div className={styles.cardText}>
              <PropertyList propertiesArray={propertiesArray} />
              {relations?.length > 0 && <RelationList relations={relations} />}
            </div>
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
