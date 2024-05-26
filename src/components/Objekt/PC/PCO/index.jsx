import { useState, useCallback, memo } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import {
  MdExpandMore as ExpandMoreIcon,
  MdInfo as InfoIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'
import sortBy from 'lodash/sortBy'
import styled from '@emotion/styled'

import { PCDescription } from '../../../shared/PCDescription.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { RelationList } from './RelationList/index.jsx'
import { PropertyList } from './PropertyList.jsx'

const Container = styled.div`
  margin: 10px 0;
`
const StyledCard = styled(Card)`
  background-color: rgb(255, 243, 224) !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
  background-color: #ffcc80;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
`
const CardActionsButtons = styled.div`
  display: flex;
`
const CardText = styled.div`
  padding: 5px 16px;
  column-width: 500px;
`

export const PcPresentation = memo(({ pC, stacked }) => {
  const [expanded, setExpanded] = useState(false)
  const [pCDescriptionExpanded, setPCDescriptionExpanded] = useState(false)

  const pCO = pC?.propertyCollectionObjectsByPropertyCollectionId?.nodes?.[0]
  const relations = pC?.relationsByPropertyCollectionId?.nodes ?? []

  const pcname = pC?.name ?? '(Name fehlt)'
  // never pass null to JSON.parse
  const properties = pCO?.properties ? JSON.parse(pCO.properties) : {}

  // never pass null to object.entries
  let propertiesArray = Object.entries(properties)
  propertiesArray = propertiesArray.filter(
    (o) => o[1] || o[1] === 0 || o[1] === false,
  )
  propertiesArray = sortBy(propertiesArray, (e) => e[0]).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, value]) => value || value === 0 || value === false,
  )

  const onClickActions = useCallback(() => setExpanded(!expanded), [expanded])
  const iconTitle = pCDescriptionExpanded
    ? 'Beschreibung der Eigenschaften-Sammlung schliessen'
    : 'Beschreibung der Eigenschaften-Sammlung öffnen'
  const onClickIcon = useCallback(
    (event) => {
      event.stopPropagation()
      setPCDescriptionExpanded(!pCDescriptionExpanded)
      setExpanded(true)
    },
    [pCDescriptionExpanded],
  )

  // console.log('PcPresentation, relations:', relations)

  return (
    <ErrorBoundary>
      <Container>
        <StyledCard>
          <StyledCardActions disableSpacing onClick={onClickActions}>
            <CardActionTitle>{pcname}</CardActionTitle>
            <CardActionsButtons>
              <IconButton
                data-expanded={pCDescriptionExpanded}
                aria-expanded={pCDescriptionExpanded}
                aria-label="über diese Eigenschaften-Sammlung"
                title={iconTitle}
                onClick={onClickIcon}
                size="large"
              >
                <Icon>
                  {!pCDescriptionExpanded && <InfoOutlineIcon />}
                  {pCDescriptionExpanded && <InfoIcon />}
                </Icon>
              </IconButton>
              <CardActionIconButton
                data-expanded={expanded}
                aria-expanded={expanded}
                aria-label="Show more"
              >
                <Icon>
                  <ExpandMoreIcon />
                </Icon>
              </CardActionIconButton>
            </CardActionsButtons>
          </StyledCardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Collapse in={pCDescriptionExpanded} timeout="auto" unmountOnExit>
              <PCDescription pC={pC} />
            </Collapse>
            <CardText>
              <PropertyList
                propertiesArray={propertiesArray}
                stacked={stacked}
              />
              {relations?.length > 0 && <RelationList relations={relations} />}
            </CardText>
          </Collapse>
        </StyledCard>
      </Container>
    </ErrorBoundary>
  )
})
