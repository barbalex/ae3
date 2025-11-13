import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { PropertyReadOnly } from '../../../shared/PropertyReadOnly.jsx'
import { PropertyReadOnlyStacked } from '../../../shared/PropertyReadOnlyStacked.jsx'
import { storeContext } from '../../../../storeContext.js'

export const PropertyList = ({ propertiesArray }) => {
  const store = useContext(storeContext)
  const { stacked } = store

  return propertiesArray.map(([key, value]) =>
    stacked ?
      <PropertyReadOnlyStacked
        key={key}
        value={value}
        label={key}
      />
    : <PropertyReadOnly
        key={key}
        value={value}
        label={key}
      />,
  )
}
