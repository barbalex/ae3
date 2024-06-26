import React, { useState, useCallback, useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import groupBy from 'lodash/groupBy'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import Properties from './Properties.jsx'
import storeContext from '../../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'

const ErrorContainer = styled.div`
  padding: 5px;
`
const StyledCard = styled(Card)`
  margin: 0;
  background-color: rgb(255, 243, 224) !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  background-color: #fff3e0;
  border-bottom: 1px solid #ebebeb;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
`
const Count = styled.span`
  font-size: x-small;
  padding-left: 5px;
`
const PropertiesContainer = styled.div`
  margin: 8px 0;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  container-type: inline-size;
`

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForFilterRCO(
    $queryExportTaxonomies: Boolean!
    $exportTaxonomies: [String]
  ) {
    rcoPropertiesByTaxonomiesFunction(taxonomyNames: $exportTaxonomies)
      @include(if: $queryExportTaxonomies) {
      nodes {
        propertyCollectionName
        relationType
        propertyName
        jsontype
        count
      }
    }
  }
`

const RCO = ({ pc }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data, error } = useQuery({
    queryKey: ['exportChooseColumnFilterRcosRco', exportTaxonomies],
    queryFn: () =>
      client.query({
        query: propsByTaxQuery,
        variables: {
          exportTaxonomies,
          queryExportTaxonomies: exportTaxonomies.length > 0,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const [expanded, setExpanded] = useState(false)
  const onClickActions = useCallback(() => setExpanded(!expanded), [expanded])

  const rcoProperties =
    data?.data?.rcoPropertiesByTaxonomiesFunction?.nodes ?? []

  const rcoPropertiesByPropertyCollection = groupBy(rcoProperties, (x) => {
    if (x.propertyCollectionName.includes(x.relationType)) {
      return x.propertyCollectionName
    }
    return `${x.propertyCollectionName}: ${x.relationType}`
  })

  if (error) {
    return (
      <ErrorContainer>`Error loading data: ${error.message}`</ErrorContainer>
    )
  }

  return (
    <ErrorBoundary>
      <StyledCard>
        <StyledCardActions disableSpacing onClick={onClickActions}>
          <CardActionTitle>
            {pc}
            <Count>{`(${rcoPropertiesByPropertyCollection?.[pc]?.length} ${
              rcoPropertiesByPropertyCollection?.[pc]?.length === 1
                ? 'Feld'
                : 'Felder'
            })`}</Count>
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <PropertiesContainer>
            <Properties properties={rcoPropertiesByPropertyCollection[pc]} />
          </PropertiesContainer>
        </Collapse>
      </StyledCard>
    </ErrorBoundary>
  )
}

export default observer(RCO)
