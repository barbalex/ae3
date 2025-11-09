import { useContext } from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { observer } from 'mobx-react-lite'

import { ComparatorSelect } from '../../../ComparatorSelect.jsx'
import { storeContext } from '../../../../../../../storeContext.js'

import { container, formControl } from './Comparator.module.css'

export const PcoComparator = observer(
  ({ pcname, pname, value, comparator }) => {
    const store = useContext(storeContext)
    const { setPcoFilter } = store.export

    const onChange = (event) =>
      setPcoFilter({ pcname, pname, comparator: event.target.value, value })

    return (
      <div className={container}>
        <FormControl
          variant="standard"
          className={formControl}
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
