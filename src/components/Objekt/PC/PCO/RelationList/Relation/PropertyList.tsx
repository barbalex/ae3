import { sortBy } from 'es-toolkit'

import { PropertyReadOnly } from '../../../../../shared/PropertyReadOnly'

type PropertyListProps = {
  properties: Record<string, any>
}

export const PropertyList = ({ properties }: PropertyListProps) =>
  sortBy(Object.entries(properties), [(e) => e[0]])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([key, value]) => value || value === 0)
    .map(([key, value]) => (
      <PropertyReadOnly
        key={key}
        value={value}
        label={key}
      />
    ))
