import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  card,
  cardActions,
  cardActionTitle,
  cardContent,
} from './HowTo.module.css'

export const HowTo = () => {
  const [expanded, setExpanded] = useState(false)
  const onClickAction = () => setExpanded(!expanded)

  return (
    <Card className={card}>
      <CardActions
        disableSpacing
        onClick={onClickAction}
        className={cardActions}
      >
        <div className={cardActionTitle}>So geht&apos;s</div>
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
        <CardContent className={cardContent}>
          <ul>
            <li>
              Nachfolgend sind alle Eigenschaften aufgelistet, die in den
              gewählten Gruppen vorkommen
            </li>
            <li>
              Erfassen Sie in den Eigenschaften Ihrer Wahl die gewünschten
              Filter-Kriterien...
            </li>
            <li>
              ...und wählen Sie danach unter &quot;3. Eigenschaften
              wählen&quot;, welche Eigenschaften exportiert werden sollen
            </li>
          </ul>
        </CardContent>
      </Collapse>
    </Card>
  )
}
