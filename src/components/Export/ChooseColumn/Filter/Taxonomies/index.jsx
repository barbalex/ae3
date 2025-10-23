import { useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Taxonomy } from './Taxonomy.jsx'
import { JointTaxonomy } from './JointTaxonomy.jsx'
import { storeContext } from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { joinTaxProperties } from './joinTaxProperties.js'

const Container = styled.div`
  margin: 10px 0;
`
const ErrorContainer = styled.div`
  padding: 5px;
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
const Count = styled.span`
  font-size: x-small;
  padding-left: 5px;
`

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForFilterTaxonomies(
    $queryExportTaxonomies: Boolean!
    $exportTaxonomies: [String]
  ) {
    taxPropertiesByTaxonomiesFunction(taxonomyNames: $exportTaxonomies)
      @include(if: $queryExportTaxonomies) {
      nodes {
        taxonomyName
        propertyName
        jsontype
        count
      }
    }
  }
`

export const Taxonomies = observer(
  ({ taxonomiesExpanded, onToggleTaxonomies }) => {
    const apolloClient = useApolloClient()

    const store = useContext(storeContext)
    const exportTaxonomies = store.export.taxonomies.toJSON()

    const { data, error, loading } = useQuery({
      queryKey: ['exportChooseColumnFilterTaxonomiesCard', exportTaxonomies],
      queryFn: () =>
        apolloClient.query({
          query: propsByTaxQuery,
          variables: {
            exportTaxonomies,
            queryExportTaxonomies: exportTaxonomies.length > 0,
          },
          fetchPolicy: 'no-cache',
        }),
    })
    const taxProperties =
      data?.data?.taxPropertiesByTaxonomiesFunction?.nodes ?? []

    const taxPropertiesByTaxonomy = groupBy(
      taxProperties,
      (p) => p.taxonomyName,
    )
    const taxPropertiesFields = groupBy(taxProperties, (p) => p.propertyName)
    const taxCount = Object.keys(taxPropertiesByTaxonomy).length
    const taxFieldsCount = Object.keys(taxPropertiesFields).length
    const initiallyExpanded = Object.keys(taxPropertiesByTaxonomy).length === 1

    const jointTaxProperties = joinTaxProperties({
      taxCount,
      taxProperties,
    })

    if (error) {
      return (
        <ErrorContainer>`Error loading data: ${error.message}`</ErrorContainer>
      )
    }

    return (
      <ErrorBoundary>
        <Container>
          <StyledCard>
            <StyledCardActions
              disableSpacing
              onClick={onToggleTaxonomies}
            >
              <CardActionTitle>
                Taxonomien
                <Count>{`(${loading ? '...' : taxCount} ${
                  taxCount === 1 ? 'Taxonomie' : 'Taxonomien'
                }, ${loading ? '...' : taxFieldsCount} ${
                  taxFieldsCount === 1 ? 'Feld' : 'Felder'
                })`}</Count>
              </CardActionTitle>
              <CardActionIconButton
                data-expanded={taxonomiesExpanded}
                aria-expanded={taxonomiesExpanded}
                aria-label="Show more"
              >
                <Icon>
                  <ExpandMoreIcon />
                </Icon>
              </CardActionIconButton>
            </StyledCardActions>
            <Collapse
              in={taxonomiesExpanded}
              timeout="auto"
              unmountOnExit
            >
              {jointTaxProperties.length > 0 && (
                <JointTaxonomy jointTaxProperties={jointTaxProperties} />
              )}
              {Object.keys(taxPropertiesByTaxonomy).map((pc) => (
                <Taxonomy
                  pc={pc}
                  key={pc}
                  initiallyExpanded={initiallyExpanded}
                />
              ))}
            </Collapse>
          </StyledCard>
        </Container>
      </ErrorBoundary>
    )
  },
)
