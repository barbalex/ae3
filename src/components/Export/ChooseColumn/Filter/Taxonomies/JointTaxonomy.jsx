import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Properties } from './Properties.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'

import styles from './JointTaxonomy.module.css'

export const JointTaxonomy = ({ jointTaxProperties }) => {
  const [expanded, setExpanded] = useState(false)
  const onClickActions = () => setExpanded(!expanded)

  return (
    <ErrorBoundary>
      <Card className={styles.card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={styles.cardActions}
        >
          <div className={styles.cardActionTitle}>
            {`Gemeinsame Felder`}
            <span
              className={styles.count}
            >{`(${jointTaxProperties.length})`}</span>
          </div>
          <IconButton
            aria-expanded={expanded}
            aria-label="Show more"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <div className={styles.propertiesContainer}>
            <Properties properties={jointTaxProperties} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
