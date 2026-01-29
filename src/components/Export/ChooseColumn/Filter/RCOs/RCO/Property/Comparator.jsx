import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useSetAtom, useAtomValue } from 'jotai'

import { ComparatorSelect } from '../../../ComparatorSelect.jsx'
import { exportRcoFiltersAtom } from '../../../../../../../store/index.ts'

import styles from './Comparator.module.css'

export const Comparator = ({
  pcname,
  relationtype,
  pname,
  value,
  comparator,
}) => {
  const rcoFilters = useAtomValue(exportRcoFiltersAtom)
  const setRcoFilters = useSetAtom(exportRcoFiltersAtom)

  const onChange = (event) => {
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
