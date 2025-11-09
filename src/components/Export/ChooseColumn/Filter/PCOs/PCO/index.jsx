import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Properties } from './Properties.jsx'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'

import {
  card,
  cardActions,
  cardActionTitle,
  countClass,
  propertiesContainer,
} from './index.module.css'

export const PCO = ({ pc, count }) => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)

  return (
    <ErrorBoundary>
      <Card
        key={pc}
        className={card}
      >
        <CardActions
          disableSpacing
          onClick={onClickAction}
          className={cardActions}
        >
          <div className={cardActionTitle}>
            {pc}
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
        >
          <div className={propertiesContainer}>
            <Properties pc={pc} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
