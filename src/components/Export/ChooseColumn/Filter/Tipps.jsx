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
} from './Tipps.module.css'

export const Tipps = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
        className={cardActions}
      >
        <div className={cardActionTitle}>Tipps und Tricks</div>
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
              {`Sie können nach beliebig vielen Eigenschaften filtern. Jedes Kriterium reduziert die Anzahl "Treffer".`}
              <br />
              {`Beispiel: Filtern Sie im Namen nach "Eisvogel" und in der Ordnung nach "Lepidoptera", erhalten Sie drei Schmetterlinge aber nicht den entsprechenden Vogel.`}
            </li>
            <li>
              {`Sie möchten nach "Schmetterlinge" oder "Vögel" suchen? Exportieren Sie zuerst "Schmetterlinge", danach die "Vögel" und setzen die zwei Exporte zusammen.`}
            </li>
            <li>
              {`Sie können Vergleichsoperatoren verwenden.`}
              <br />
              {`Das Feld, um sie zu wählen erscheint, nachdem ein Filter-Wert erfasst wurde.`}
            </li>
            <li>
              {`Es kommt nicht auf Gross-/Kleinschreibung an.`}
              <br />
              {`Beispiel: Schreiben Sie "eisvogel", wird auch "Eisvogel" gefunden.`}
              <br />
              {`Sie möchten nach Gross-/Kleinschreibung unterscheiden? Dann wählen Sie den Vergleichsoperator "=".`}
            </li>
            <li>
              {`Sie können nach einem Teil des Feldinhalts filtern.`}
              <br />
              {`Beispiel: Schreiben Sie "Vogel", wird auch "Eisvogel" gefunden.`}
              <br />
              {`Sie möchten nach dem ganzen Feldinhalt filtern? Dann wählen Sie den Vergleichsoperator "=".`}
            </li>
            <li>
              {`Wenn Sie Filter-Werte eingeben, erscheint eine Liste der diese Zeichen enthaltenden Werte dieses Feldes.`}
              <br />
              {`Sie können die ungefilterte Liste aller enthaltenen Werte öffnen, indem Sie einen Leerschlag tippen.`}
            </li>
          </ul>
        </CardContent>
      </Collapse>
    </Card>
  )
}
