import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  card,
  cardActions,
  cardActionTitle,
  cardContent,
} from './HowTo.module.css'

export const HowTo = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
        className={cardActions}
      >
        <div className={cardActionTitle}>So geht's</div>
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
        <CardContent className={cardContent}>
          <ul>
            <li>
              Nachfolgend sind alle Eigenschaften aufgelistet, die in den
              gewählten Taxonomien vorkommen
            </li>
            <li>
              Markieren Sie die Eigenschaften, die Sie exportieren möchten...
            </li>
            <li>...und laden Sie danach die Daten herunter</li>
          </ul>
        </CardContent>
      </Collapse>
    </Card>
  )
}
