import { useState, useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'

import { AllChooser } from './AllChooser.jsx'
import { Properties } from '../Properties.jsx'
import storeContext from '../../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'

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
const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
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

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForPropertiesTaxonomy(
    $queryExportTaxonomies: Boolean!
    $exportTaxonomies: [String]
  ) {
    taxPropertiesOnlyByTaxonomiesFunction(taxonomyNames: $exportTaxonomies)
      @include(if: $queryExportTaxonomies) {
      nodes {
        taxonomyName
        propertyName
        count
      }
    }
  }
`

export const Taxonomy = observer(({ initiallyExpanded, tax }) => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const { data: propsByTaxData, error: propsByTaxError } = useQuery(
    propsByTaxQuery,
    {
      variables: {
        exportTaxonomies,
        queryExportTaxonomies: exportTaxonomies.length > 0,
      },
    },
  )

  const [expanded, setExpanded] = useState(initiallyExpanded)
  const onClickActions = () => setExpanded(!expanded)

  const taxProperties =
    propsByTaxData?.taxPropertiesOnlyByTaxonomiesFunction?.nodes ?? []
  const taxPropertiesByTaxonomy = groupBy(taxProperties, (p) => p.taxonomyName)

  if (propsByTaxError) return `Error fetching data: ${propsByTaxError.message}`

  if (propsByTaxData === undefined) return <Spinner />

  const properties = taxPropertiesByTaxonomy[tax]

  return (
    <ErrorBoundary>
      <StyledCard>
        <StyledCardActions
          disableSpacing
          onClick={onClickActions}
        >
          <CardActionTitle>
            {tax}
            <Count>{`(${properties.length} ${
              properties.length === 1 ? 'Feld' : 'Felder'
            })`}</Count>
            <CardActionIconButton
              data-expanded={expanded}
              aria-expanded={expanded}
              aria-label="Show more"
            >
              <Icon>
                <ExpandMoreIcon />
              </Icon>
            </CardActionIconButton>
          </CardActionTitle>
        </StyledCardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <StyledCardContent>
            <>
              {properties.length > 1 && <AllChooser properties={properties} />}
              <PropertiesContainer>
                <Properties properties={properties} />
              </PropertiesContainer>
            </>
          </StyledCardContent>
        </Collapse>
      </StyledCard>
    </ErrorBoundary>
  )
})
