import { useContext } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { groupBy, sumBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { TaxonomiesList } from './TaxonomiesList.jsx'
import { JointTaxonomy } from './JointTaxonomy.jsx'
import { storeContext } from '../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'

import {
  container,
  card,
  cardActions,
  cardActionTitle,
  count,
} from './index.module.css'

const propsByTaxQuery = gql`
  query propsByTaxDataQueryForPropertiesTaxonomies(
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
    const store = useContext(storeContext)
    const exportTaxonomies = store.export.taxonomies.toJSON()
    const apolloClient = useApolloClient()

    const { data: propsByTaxData, error: propsByTaxError } = useQuery({
      queryKey: ['taxPropertiesByTaxonomies', exportTaxonomies],
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
      propsByTaxData?.data?.taxPropertiesByTaxonomiesFunction?.nodes ?? []

    const taxPropertiesByTaxonomy = groupBy(
      taxProperties,
      (p) => p.taxonomyName,
    )
    const taxPropertiesFields = groupBy(taxProperties, (p) => p.propertyName)
    const taxonomies = Object.keys(taxPropertiesByTaxonomy)
    const taxCount = taxonomies.length
    const taxFieldsCount = Object.keys(taxPropertiesFields).length
    let jointTaxProperties = []
    if (taxCount > 1) {
      jointTaxProperties = Object.values(
        groupBy(taxProperties, (t) => `${t.propertyName}/${t.jsontype}`),
      )
        .filter((v) => v.length === taxCount)
        .map((t) => ({
          count: sumBy(t, (x) => Number(x.count)),
          jsontype: t[0].jsontype,
          propertyName: t[0].propertyName,
          taxonomies: t.map((x) => x.taxonomyName),
          taxname: 'Taxonomie',
        }))
    }
    const initiallyExpanded = taxonomies.length === 1

    if (propsByTaxError)
      return `Error fetching data: ${propsByTaxError.message}`

    return (
      <ErrorBoundary>
        <div className={container}>
          <Card className={card}>
            <CardActions
              disableSpacing
              onClick={onToggleTaxonomies}
              className={cardActions}
            >
              <div className={cardActionTitle}>
                Taxonomien
                {taxCount > 0 && (
                  <span className={count}>{`(${taxCount} ${
                    taxCount === 1 ? 'Taxonomie' : 'Taxonomien'
                  }, ${taxFieldsCount} ${
                    taxFieldsCount === 1 ? 'Feld' : 'Felder'
                  })`}</span>
                )}
              </div>
              <IconButton
                aria-expanded={taxonomiesExpanded}
                aria-label="Show more"
                style={{
                  transform: taxonomiesExpanded ? 'rotate(180deg)' : 'none',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse
              in={taxonomiesExpanded}
              timeout="auto"
              unmountOnExit
            >
              {jointTaxProperties.length > 0 && (
                <JointTaxonomy jointTaxProperties={jointTaxProperties} />
              )}
              <TaxonomiesList
                taxonomies={taxonomies}
                initiallyExpanded={initiallyExpanded}
              />
            </Collapse>
          </Card>
        </div>
      </ErrorBoundary>
    )
  },
)
