import React from 'react'

import Relation from './Relation/index.jsx'

const RelationList = ({ relations }) =>
  relations.map((relation, index) => (
    <Relation
      key={relation.id}
      relation={relation}
      intermediateRelation={index < relations.length - 1}
    />
  ))

export default RelationList
