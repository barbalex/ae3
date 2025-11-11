import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Chooser } from './Chooser/index.jsx'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'

import {
  card,
  cardActions,
  cardActionTitle,
  collapse,
  countClass,
} from './index.module.css'

export const PCO = ({ pcName, count }) => {
  const [expanded, setExpanded] = useState(false)
  const onClickActions = () => setExpanded(!expanded)

  return (
    <ErrorBoundary>
      <Card className={card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={cardActions}
        >
          <div className={cardActionTitle}>
            {pcName}
            <span
              className={countClass}
            >{`(${count} ${count === 1 ? 'Feld' : 'Felder'})`}</span>
          </div>
          <IconButton
            aria-expanded={expanded}
            aria-label="Show more"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            <Icon>
              <ExpandMoreIcon />
            </Icon>
          </IconButton>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          className={collapse}
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
