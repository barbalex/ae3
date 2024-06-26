import { memo } from 'react'
import sortBy from 'lodash/sortBy'

import { PropertyReadOnly } from '../../../../../shared/PropertyReadOnly.jsx'

export const PropertyList = memo(({ properties }) =>
  sortBy(Object.entries(properties), (e) => e[0])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([key, value]) => value || value === 0)
    .map(([key, value]) => (
      <PropertyReadOnly key={key} value={value} label={key} />
    )),
)
