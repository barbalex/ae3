import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Properties } from './Properties.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'

import {
  card,
  cardActions,
  cardActionTitle,
  count,
  propertiesContainer,
} from './JointTaxonomy.module.css'

export const JointTaxonomy = ({ jointTaxProperties }) => {
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
            {`Gemeinsame Felder`}
            <span className={count}>{`(${jointTaxProperties.length})`}</span>
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
            <Properties properties={jointTaxProperties} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
