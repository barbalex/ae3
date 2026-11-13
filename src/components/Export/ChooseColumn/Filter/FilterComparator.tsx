import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useSetAtom, useAtomValue } from 'jotai'
import type { PrimitiveAtom } from 'jotai'

import { ComparatorSelect } from './ComparatorSelect'

import styles from './FilterComparator.module.css'

export type FilterComparatorProps = {
  // identifies the field being filtered; every entry must match a
  // filter entry, e.g. { taxname, pname } or { pcname, relationtype, pname }
  fieldId: Record<string, any>
  comparator: string | null
  value: string | number | null
  filtersAtom: PrimitiveAtom<any[]>
  // comparator used when the select is cleared (tax fields keep ILIKE)
  defaultComparator?: string
}

export const FilterComparator = ({
  fieldId,
  comparator,
  value,
  filtersAtom,
  defaultComparator,
}: FilterComparatorProps) => {
  const filters = useAtomValue(filtersAtom)
  const setFilters = useSetAtom(filtersAtom)

  const isField = (f: any) =>
    Object.entries(fieldId).every(([key, val]) => f[key] === val)

  const onChange = (event: SelectChangeEvent<string | null>) => {
    const newComparator = event.target.value || defaultComparator
    // edit = replace existing, or add new one
    setFilters([
      ...filters.filter((f) => !isField(f)),
      { ...fieldId, comparator: newComparator, value },
    ])
  }

  return (
    <div className={styles.container}>
      <FormControl
        variant="standard"
        className={styles.formControl}
      >
        <InputLabel htmlFor="v-op">Vergleichs-Operator</InputLabel>
        <ComparatorSelect
          comparator={comparator}
          onChange={onChange}
        />
      </FormControl>
    </div>
  )
}
