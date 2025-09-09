import styled from '@emotion/styled'
import { useQuery } from '@apollo/client/react'

import { PcPresentation } from './PCO/index.jsx'
import query from './query.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

const Container2 = styled.div`
  padding: 10px;
`

export const PC = ({ pcId, objId, stacked = false }) => {
  const { data, error } = useQuery(query, {
    variables: {
      pcId,
      objId,
    },
  })

  const pC = data?.propertyCollectionById

  // dont want too many spinners
  if (!pC) return <div />

  // if (loading) return <Spinner />
  if (error) {
    return <Container2>{`Fehler: ${error.message}`}</Container2>
  }

  return (
    <ErrorBoundary>
      <PcPresentation
        pC={pC}
        stacked={stacked}
      />
    </ErrorBoundary>
  )
}
