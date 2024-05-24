import React, { useState, useCallback } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import AllChooser from './Taxonomy/AllChooser.jsx'
import Properties from './Properties.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'

const StyledCard = styled(Card)`
  margin: 0;
  background-color: rgb(255, 243, 224) !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
  background-color: #fff3e0;
  border-bottom: 1px solid #ebebeb;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
`
const StyledCollapse = styled(Collapse)`
  display: flex;
  flex-direction: column;
  padding: 8px 14px;
`
const PropertiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  container-type: inline-size;
`
const Count = styled.span`
  font-size: x-small;
  padding-left: 5px;
`

const JointTaxonomy = ({ jointTaxProperties }) => {
  const [expanded, setExpanded] = useState(false)
  const onClickActions = useCallback(() => setExpanded(!expanded), [expanded])

  return (
    <ErrorBoundary>
      <StyledCard key="jointTax">
        <StyledCardActions disableSpacing onClick={onClickActions}>
          <CardActionTitle>
            {`Gemeinsame Felder`}
            <Count>{`(${jointTaxProperties.length})`}</Count>
          </CardActionTitle>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <Icon>
              <ExpandMoreIcon />
            </Icon>
          </CardActionIconButton>
        </StyledCardActions>
        <StyledCollapse in={expanded} timeout="auto" unmountOnExit>
          {jointTaxProperties.length > 1 && (
            <AllChooser properties={jointTaxProperties} />
          )}
          <PropertiesContainer>
            <Properties properties={jointTaxProperties} />
          </PropertiesContainer>
        </StyledCollapse>
      </StyledCard>
    </ErrorBoundary>
  )
}

export default observer(JointTaxonomy)
