import { useAtomValue } from 'jotai'

import { PropertyReadOnly } from '../../../shared/PropertyReadOnly'
import { PropertyReadOnlyStacked } from '../../../shared/PropertyReadOnlyStacked'
import { stackedAtom } from '../../../../store'

type PropertyListProps = {
  propertiesArray: [string, any][]
}

export const PropertyList = ({ propertiesArray }: PropertyListProps) => {
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
