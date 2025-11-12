import { Suspense } from 'react'
import { useQuery } from '@apollo/client/react'

import { PcPresentation } from './PCO/index.jsx'
import query from './query.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import { errorContainer } from './index.module.css'

export const PC = ({ pcId, objId, stacked = false }) => {
  const { data, error } = useQuery(query, {
    variables: {
      pcId,
      objId,
    },
  })

  const pC = data?.propertyCollectionById

  if (error) {
    return <div className={errorContainer}>{`Fehler: ${error.message}`}</div>
  }

  // don't want too many spinners
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <PcPresentation
          pC={pC}
          stacked={stacked}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
