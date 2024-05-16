import React from 'react'

import Item from './Item.jsx'

const ExportPcoPropertiesListItems = ({ pcoProperties }) =>
  pcoProperties.map((p) => (
    <Item key={`${p.pcname}: ${p.pname}`} properties={p} />
  ))

export default ExportPcoPropertiesListItems
