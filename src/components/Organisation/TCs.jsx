import { useContext, Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { appBaseUrl } from '../../modules/appBaseUrl.js'
import { storeContext } from '../../storeContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import styles from './TCs.module.css'

const tcsQuery = gql`
  query orgTCsQuery($id: UUID!) {
    organizationById(id: $id) {
      id
      taxonomiesByOrganizationId {
        totalCount
        nodes {
          id
          name
        }
      }
    }
  }
`

export const TCs = observer(() => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const apolloClient = useApolloClient()
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error } = useQuery({
    queryKey: ['organizationTCs', id],
    queryFn: () =>
      apolloClient.query({
        query: tcsQuery,
        variables: { id },
      }),
  })

  const tcs = sortBy(
    data?.data?.organizationById?.taxonomiesByOrganizationId?.nodes ?? [],
    ['name'],
  )

  if (error)
    return <div className={styles.container}>{`Fehler: ${error.message}`}</div>

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={styles.container}>
          <div className={styles.list}>
            <ul>
              {tcs.map((u) => {
                const elem2 = u.type === 'ART' ? 'Arten' : 'Lebensräume'
                const link = `${appBaseUrl}${encodeURIComponent(elem2)}/${u.id}`

                return (
                  <li key={u.name}>
                    <a
                      href={link}
                      target="_blank"
                      className={styles.a}
                    >
                      {u.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
})
