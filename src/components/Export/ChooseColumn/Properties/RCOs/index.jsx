import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RcList } from './RcList/index.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { exportTaxonomiesAtom } from '../../../../../jotaiStore/index.ts'

import styles from './index.module.css'

const query = gql`
  query exportRcoCountQuery($exportTaxonomies: [String!]) {
    exportRcoCount(exportTaxonomies: $exportTaxonomies) {
      propertyCount
      pcReltypeCount
    }
  }
`

export const RCOs = ({ rcoExpanded, onToggleRco }) => {
  const exportTaxonomies = useAtomValue(exportTaxonomiesAtom)
  const apolloClient = useApolloClient()

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ['exportRcoCount', exportTaxonomies],
    queryFn: () =>
      apolloClient.query({
        query: query,
        variables: {
          exportTaxonomies,
        },
      }),
  })

  const pcCount = data?.data?.exportRcoCount?.pcReltypeCount ?? 0
  const propertyCount = data?.data?.exportRcoCount?.propertyCount ?? 0

  if (error) return `Error fetching data: ${error.message}`

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Card className={styles.card}>
          <CardActions
            disableSpacing
            onClick={onToggleRco}
            className={styles.cardActions}
          >
            <div className={styles.cardActionTitle}>
              Beziehungssammlungen
              <span
                className={styles.count}
              >{`(${loading ? '...' : pcCount} Sammlungen, ${
                loading ? '...' : propertyCount
              } ${propertyCount === 1 ? 'Feld' : 'Felder'})`}</span>
            </div>
            <IconButton
              aria-expanded={rcoExpanded}
              aria-label="Show more"
              style={{ transform: rcoExpanded ? 'rotate(180deg)' : 'none' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={rcoExpanded}
            timeout="auto"
            unmountOnExit
          >
            <RcList />
          </Collapse>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
