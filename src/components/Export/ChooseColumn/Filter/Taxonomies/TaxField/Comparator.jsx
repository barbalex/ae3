import { useContext } from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { observer } from 'mobx-react-lite'

import { ComparatorSelect } from '../../ComparatorSelect.jsx'
import { storeContext } from '../../../../../../storeContext.js'

import styles from './Comparator.module.css'

export const Comparator = observer(({ comparator, taxname, pname, value }) => {
  const store = useContext(storeContext)
  const { setTaxFilters } = store.export

  const onChange = (event) =>
    setTaxFilters({
      taxname,
      pname,
      comparator: event.target.value || 'ILIKE',
      value,
    })

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
})
