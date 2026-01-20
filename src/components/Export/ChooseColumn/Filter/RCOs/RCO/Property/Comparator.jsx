import { useContext } from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { observer } from 'mobx-react-lite'

import { ComparatorSelect } from '../../../ComparatorSelect.jsx'
import { storeContext } from '../../../../../../../storeContext.js'

import styles from './Comparator.module.css'

export const Comparator = observer(
  ({ pcname, relationtype, pname, value, comparator }) => {
    const store = useContext(storeContext)
    const { setRcoFilters } = store.export

    const onChange = (event) =>
      setRcoFilters({
        pcname,
        relationtype,
        pname,
        comparator: event.target.value,
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
  },
)
