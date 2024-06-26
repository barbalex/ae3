import React from 'react'

import Chooser from './Taxonomy/Chooser.jsx'

const TaxProperties = ({ properties }) =>
  properties.map((p) => (
    <Chooser
      key={`${p.propertyName}${p.jsontype}`}
      taxname={p.taxonomyName}
      pname={p.propertyName}
      jsontype={p.jsontype}
      count={p.count}
    />
  ))

export default TaxProperties
