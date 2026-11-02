import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useAtom } from 'jotai'

import { ComparatorSelect } from '../../ComparatorSelect'
import { exportTaxFiltersAtom } from '../../../../../../store'

import styles from './Comparator.module.css'

type ComparatorProps = {
  comparator: string | null
  taxname: string
  pname: string
  value: string | number | null
}

export const Comparator = ({
  comparator,
  taxname,
  pname,
  value,
}: ComparatorProps) => {
  const [taxFilters, setTaxFilters] = useAtom(exportTaxFiltersAtom)

  const onChange = (event: SelectChangeEvent<string | null>) => {
    const newComparator = event.target.value || 'ILIKE'
    const taxFilter = taxFilters.find(
      (x) => x.taxname === taxname && x.pname === pname,
    )
    if (!taxFilter) {
      setTaxFilters([
        ...taxFilters,
        {
          taxname,
          pname,
          comparator: newComparator,
          value,
        },
      ])
    } else {
      setTaxFilters([
        ...taxFilters.filter(
          (x) => !(x.taxname === taxname && x.pname === pname),
        ),
        {
          taxname,
          pname,
          comparator: newComparator,
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
