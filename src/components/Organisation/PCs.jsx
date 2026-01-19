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

import { container, list, a } from './PCs.module.css'

const pcsQuery = gql`
  query orgPCsQuery($id: UUID!) {
    organizationById(id: $id) {
      id
      propertyCollectionsByOrganizationId {
        totalCount
        nodes {
          id
          name
        }
      }
    }
  }
`

export const PCs = observer(() => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const apolloClient = useApolloClient()
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error } = useQuery({
    queryKey: ['organizationPCs', id],
    queryFn: () =>
      apolloClient.query({
        query: pcsQuery,
        variables: { id },
      }),
  })

  const pcs = sortBy(
    data?.data?.organizationById?.propertyCollectionsByOrganizationId?.nodes ??
      [],
    ['name'],
  )

  if (error)
    return <div className={container}>{`Fehler: ${error.message}`}</div>

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={container}>
          <div className={list}>
            <ul>
              {pcs.map((u) => (
                <li key={u.name}>
                  <a
                    href={`${appBaseUrl}Eigenschaften-Sammlungen/${u.id}`}
                    target="_blank"
                    className={a}
                  >
                    {u.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
})
