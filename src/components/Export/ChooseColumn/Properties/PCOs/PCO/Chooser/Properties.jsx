import React from 'react'

import Chooser from './Chooser'

const PCO = ({ properties, pcName }) =>
  properties.map((p) => (
    <Chooser
      key={`${p.property}${p.type}`}
      pcname={pcName}
      pname={p.property}
      jsontype={p.type}
    />
  ))

export default PCO
