import { useAtomValue } from 'jotai'

import { PropertyReadOnly } from '../../../shared/PropertyReadOnly.jsx'
import { PropertyReadOnlyStacked } from '../../../shared/PropertyReadOnlyStacked.jsx'
import { stackedAtom } from '../../../../jotaiStore/index.ts'

export const PropertyList = ({ propertiesArray }) => {
  const stacked = useAtomValue(stackedAtom)

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
