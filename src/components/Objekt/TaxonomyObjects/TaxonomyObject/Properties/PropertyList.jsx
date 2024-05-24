import React from 'react'
import sortBy from 'lodash/sortBy'

import { PropertyReadOnly } from '../../../../shared/PropertyReadOnly.jsx'
import PropertyReadOnlyStacked from '../../../../shared/PropertyReadOnlyStacked.jsx'
import Property from '../../../../shared/Property.jsx'

const PropertyList = ({ propertiesArray, properties, editing, stacked, id }) =>
  sortBy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    propertiesArray.filter(([key, value]) => value || value === 0),
    (e) => e[0],
  ).map(([key, value]) =>
    editing ? (
      <Property
        key={`${id}/${key}/${value}`}
        id={id}
        properties={properties}
        field={key}
      />
    ) : stacked ? (
      <PropertyReadOnlyStacked key={key} value={value} label={key} />
    ) : (
      <PropertyReadOnly key={key} value={value} label={key} />
    ),
  )

export default PropertyList
