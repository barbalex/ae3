import React from 'react'

import PropertyReadOnly from '../../../shared/PropertyReadOnly.jsx'
import PropertyReadOnlyStacked from '../../../shared/PropertyReadOnlyStacked.jsx'

export const PropertyList = ({ propertiesArray, stacked }) =>
  propertiesArray.map(([key, value]) =>
    stacked ? (
      <PropertyReadOnlyStacked key={key} value={value} label={key} />
    ) : (
      <PropertyReadOnly key={key} value={value} label={key} />
    ),
  )
