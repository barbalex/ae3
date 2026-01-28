import { sortBy } from 'es-toolkit'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PropertyReadOnly } from '../../../../shared/PropertyReadOnly.jsx'
import { PropertyReadOnlyStacked } from '../../../../shared/PropertyReadOnlyStacked.jsx'
import { Property } from '../../../../shared/Property.jsx'
import { stackedAtom } from '../../../../../jotaiStore/index.ts'

export const PropertyList = ({ propertiesArray, properties, editing, id, refetch }) => {
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
