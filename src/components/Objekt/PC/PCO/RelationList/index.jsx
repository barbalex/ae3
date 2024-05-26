import React from 'react'
import styled from '@emotion/styled'

import { Relation } from './Relation/index.jsx'

const Title = styled.div`
  font-weight: bold;
  border-bottom: 1px solid #c6c6c6;
  padding: 5px;
  border-radius: 4px 4px 0 0;
  margin-bottom: 10px;
`

export const RelationList = ({ relations }) => {
  const relationsTitleText =
    relations.length > 1 ? 'Beziehungen:' : 'Beziehung:'
  const relationsTitle = `${relations.length} ${relationsTitleText}`

  return (
    <>
      <Title>{relationsTitle}</Title>
      {relations.map((relation, index) => (
        <Relation
          key={relation.id}
          relation={relation}
          intermediateRelation={index < relations.length - 1}
        />
      ))}
    </>
  )
}
