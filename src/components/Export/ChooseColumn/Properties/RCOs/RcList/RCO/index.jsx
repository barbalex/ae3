import { useState, useContext, Suspense } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'

import { AllChooser } from './AllChooser.jsx'
import { Properties } from './Properties.jsx'
import { storeContext } from '../../../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../../../shared/Spinner.jsx'

import {
  propertiesContainer,
  card,
  cardActions,
  cardActionTitle,
  collapse,
  countClass,
  spinnerContainer,
} from './index.module.css'

const query = gql`
  query exportRcoPerRcoRelationQuery(
    $exportTaxonomies: [String!]
    $pcname: String!
    $relationtype: String!
  ) {
    exportRcoPerRcoRelation(
      exportTaxonomies: $exportTaxonomies
      pcname: $pcname
      relationtype: $relationtype
    ) {
      nodes {
        pcname
        property
        jsontype
      }
    }
  }
`

const fallback = (
  <div className={spinnerContainer}>
    <Spinner message="" />
  </div>
)

export const RCO = observer(({ pcname, relationtype, count }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery(query, {
    variables: {
      exportTaxonomies,
      pcname,
      relationtype,
    },
  })

  // spread to prevent node is not extensible error
  const nodes = [...(data?.exportRcoPerRcoRelation?.nodes ?? [])]
  const bezPartnerNodes = nodes.filter(
    (n) => n.property === 'Beziehungspartner',
  )
  if (bezPartnerNodes.length === 0) {
    nodes.unshift({
      pcname,
      property: 'Beziehungspartner',
      jsontype: 'Boolean',
    })
  }

  const [expanded, setExpanded] = useState(false)

  const onClickActions = () => setExpanded(!expanded)

  if (error) return `Error fetching data: ${error.message}`

  return (
    <ErrorBoundary>
      <Card className={card}>
        <CardActions
          disableSpacing
          onClick={onClickActions}
          className={cardActions}
        >
          <div className={cardActionTitle}>
            {`${pcname}: ${relationtype}`}
            <span className={countClass}>{`(${count ?? 0} ${
              count === 1 ? 'Feld' : 'Felder'
            })`}</span>
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
          className={collapse}
        >
          <Suspense fallback={fallback}>
            {count > 1 && (
              <AllChooser
                properties={nodes}
                relationtype={relationtype}
              />
            )}
            <div className={propertiesContainer}>
              <Properties
                properties={nodes}
                relationtype={relationtype}
              />
            </div>
          </Suspense>
        </Collapse>
      </Card>
    </ErrorBoundary>
  )
})
