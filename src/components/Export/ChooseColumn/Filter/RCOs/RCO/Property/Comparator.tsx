import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useSetAtom, useAtomValue } from 'jotai'

import { ComparatorSelect } from '../../../ComparatorSelect'
import { exportRcoFiltersAtom } from '../../../../../../../store'

import styles from './Comparator.module.css'

type ComparatorProps = {
  pcname: string
  relationtype: string
  pname: string
  value: string | number | null
  comparator: string | null
}

export const Comparator = ({
  pcname,
  relationtype,
  pname,
  value,
  comparator,
}: ComparatorProps) => {
  const rcoFilters = useAtomValue(exportRcoFiltersAtom)
  const setRcoFilters = useSetAtom(exportRcoFiltersAtom)

  const onChange = (event: SelectChangeEvent<string | null>) => {
    const rcoFilter = rcoFilters.find(
      (x) =>
        x.pcname === pcname &&
        x.relationtype === relationtype &&
        x.pname === pname,
    )
    if (!rcoFilter) {
      // add new one
      setRcoFilters([
        ...rcoFilters,
        {
          pcname,
          relationtype,
          pname,
          comparator: event.target.value,
          value,
        },
      ])
    } else {
      // edit = replace existing
      setRcoFilters([
        ...rcoFilters.filter(
          (x) =>
            !(
              x.pcname === pcname &&
              x.relationtype === relationtype &&
              x.pname === pname
            ),
        ),
        {
          pcname,
          relationtype,
          pname,
          comparator: event.target.value,
          value,
        },
      ])
    }
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
