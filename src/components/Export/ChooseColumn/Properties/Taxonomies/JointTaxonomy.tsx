import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { AllChooser } from './Taxonomy/AllChooser'
import { Properties } from './Properties'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary'

import styles from './JointTaxonomy.module.css'

type JointTaxonomyProps = {
  jointTaxProperties: any[]
}

export const JointTaxonomy = ({ jointTaxProperties }: JointTaxonomyProps) => {
  const [expanded, setExpanded] = useState(false)
  const onClickActions = () => setExpanded(!expanded)

  return (
    <ErrorBoundary>
      <Card
        key="jointTax"
        className={styles.card}
      >
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
          className={styles.collapse}
        >
          {jointTaxProperties.length > 1 && (
            <AllChooser properties={jointTaxProperties} />
          )}
          <div className={styles.propertiesContainer}>
            <Properties properties={jointTaxProperties} />
          </div>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
}
