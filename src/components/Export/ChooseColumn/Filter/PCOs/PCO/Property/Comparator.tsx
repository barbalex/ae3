import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useSetAtom, useAtomValue } from 'jotai'

import { ComparatorSelect } from '../../../ComparatorSelect'
import { exportPcoFiltersAtom } from '../../../../../../../store'

import styles from './Comparator.module.css'

type PcoComparatorProps = {
  pcname: string
  pname: string
  value: string | number | null
  comparator: string | null
}

export const PcoComparator = ({
  pcname,
  pname,
  value,
  comparator,
}: PcoComparatorProps) => {
  const pcoFilters = useAtomValue(exportPcoFiltersAtom)
  const setPcoFilters = useSetAtom(exportPcoFiltersAtom)

  const onChange = (event: SelectChangeEvent<string | null>) => {
    const pcoFilter = pcoFilters.find(
      (x) => x.pcname === pcname && x.pname === pname,
    )
    if (!pcoFilter) {
      // add new one
      setPcoFilters([
        ...pcoFilters,
        {
          pcname,
          pname,
          comparator: event.target.value,
          value,
        },
      ])
    } else {
      // edit = replace existing
      setPcoFilters([
        ...pcoFilters.filter(
          (x) => !(x.pcname === pcname && x.pname === pname),
        ),
        {
          pcname,
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
