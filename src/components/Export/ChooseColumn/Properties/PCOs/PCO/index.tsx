import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Chooser } from './Chooser'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary'

import styles from './index.module.css'

type PCOProps = {
  pcName: string
  count: number
}

export const PCO = ({ pcName, count }: PCOProps) => {
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
            {pcName}
            <span
              className={styles.countClass}
            >{`(${count} ${count === 1 ? 'Feld' : 'Felder'})`}</span>
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
          className={styles.collapse}
        >
          {expanded && (
            <Chooser
              count={count}
              pcName={pcName}
            />
          )}
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
