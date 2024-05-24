import React from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import PCOs from './PCO/index.jsx'
import query from './query.js'
import Spinner from '../../shared/Spinner.jsx'
import ErrorBoundary from '../../shared/ErrorBoundary.jsx'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`
const Container2 = styled.div`
  padding: 10px;
`

const PC = ({ pcId, objId, stacked = false }) => {
  const { data, loading, error } = useQuery(query, {
    variables: {
      pcId,
      objId,
    },
  })

  const pC = data?.propertyCollectionById
  const relations = pC?.relationsByPropertyCollectionId?.nodes ?? []
  console.log('hello PC', { pc: pC, pcId, objId })
  if (!pC) return <div />

  if (loading) return <Spinner />
  if (error) {
    return <Container2>{`Fehler: ${error.message}`}</Container2>
  }

  console.log('hello Objekt', {
    pC,
  })

  return (
    <ErrorBoundary>
      <Container>
        <PCOs pC={pC} relations={relations} stacked={stacked} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(PC)
