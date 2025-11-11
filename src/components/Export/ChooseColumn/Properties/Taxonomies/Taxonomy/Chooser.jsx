import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../storeContext.js'
import { container, countClass, label } from './Chooser.module.css'

export const Chooser = observer(({ taxname, pname, count }) => {
  const store = useContext(storeContext)
  const { taxProperties, addTaxProperty, removeTaxProperty } = store.export

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      return addTaxProperty({ taxname, pname })
    }
    return removeTaxProperty({ taxname, pname })
  }

  const checked = taxProperties.filter((x) => x.pname === pname).length > 0

  return (
    <div className={container}>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checked}
            onChange={onCheck}
          />
        }
        label={
          <div>
            {pname}{' '}
            <span
              title="Anzahl Objekte"
              className={countClass}
            >{`(${count} Objekte)`}</span>
          </div>
        }
        className={label}
      />
    </div>
  )
})
