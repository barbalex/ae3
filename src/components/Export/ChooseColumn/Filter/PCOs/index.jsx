import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PcoList } from './List.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../jotaiStore/index.ts'

import styles from './index.module.css'

const query = gql`
  query propsByTaxDataQueryForFilterPCOs($exportTaxonomies: [String!]) {
    pc_count: allPropertyCollections(
      filter: {
        propertyCollectionObjectsByPropertyCollectionId: {
          some: {
            objectByObjectId: {
              taxonomyByTaxonomyId: { name: { in: $exportTaxonomies } }
            }
          }
        }
      }
    ) {
      totalCount
    }
    property_count: pcoPropertiesByTaxonomiesCountFunction(
      exportTaxonomies: $exportTaxonomies
    )
  }
`

export const PCOs = ({ pcoExpanded, onTogglePco }) => {
  const apolloClient = useApolloClient()

  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: ['pcos', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          exportTaxonomies,
        },
      }),
  })

  const pcCount = data?.data?.pc_count?.totalCount ?? 0
  const propertyCount = data?.data?.property_count ?? 0

  if (error) {
    return (
      <div className={styles.errorContainer}>
        `Error loading data: ${error.message}`
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Card className={styles.card}>
          <CardActions
            disableSpacing
            onClick={onTogglePco}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>
              Eigenschaftensammlungen
              <span
                className={styles.count}
              >{`(${isLoading ? '...' : pcCount} Sammlungen, ${
                isLoading ? '...' : propertyCount
              } ${propertyCount === 1 ? 'Feld' : 'Felder'})`}</span>
            </div>
            <IconButton
              aria-expanded={pcoExpanded}
              aria-label="Show more"
              style={{ transform: pcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={pcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <PcoList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
