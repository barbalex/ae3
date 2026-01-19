import { Suspense } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { PcPresentation } from './PCO/index.jsx'
import query from './query.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import { errorContainer } from './index.module.css'

export const PC = ({ pcId, objId }) => {
  const apolloClient = useApolloClient()
  const { data, error } = useQuery({
    queryKey: ['pc', pcId, objId],
    queryFn: () =>
      apolloClient.query({
        query: query,
        variables: {
          pcId,
          objId,
        },
      }),
  })

  const pC = data?.data?.propertyCollectionById

  if (error) {
    return <div className={errorContainer}>{`Fehler: ${error.message}`}</div>
  }

  // don't want too many spinners
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <PcPresentation pC={pC} />
      </Suspense>
    </ErrorBoundary>
  )
}
