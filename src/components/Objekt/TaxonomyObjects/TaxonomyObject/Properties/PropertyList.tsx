import { sortBy } from 'es-toolkit'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PropertyReadOnly } from '../../../../shared/PropertyReadOnly'
import { PropertyReadOnlyStacked } from '../../../../shared/PropertyReadOnlyStacked'
import { Property } from '../../../../shared/Property'
import { stackedAtom } from '../../../../../store'

type PropertyListProps = {
  propertiesArray: [string, any][]
  properties: any
  editing?: boolean
  id: string
  refetch?: () => void
}

export const PropertyList = ({ propertiesArray, properties, editing, id, refetch }: PropertyListProps) => {
  const stacked = useAtomValue(stackedAtom)

  const queryClient = useQueryClient()

  return sortBy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    propertiesArray.filter(([key, value]) => value || value === 0),
    [(e) => e[0]],
  ).map(([key, value]) =>
    editing ?
      <Property
        key={`${id}/${key}/${value}`}
        id={id}
        properties={properties}
        field={key}
        refetch={refetch}
      />
    : stacked ?
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
