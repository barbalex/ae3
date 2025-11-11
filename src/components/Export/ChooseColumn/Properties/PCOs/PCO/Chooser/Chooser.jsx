import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../../storeContext.js'
import { constants } from '../../../../../../../modules/constants.js'

import { container, label } from './Chooser.module.css'

export const Chooser = observer(({ pcname, pname }) => {
  const store = useContext(storeContext)
  const { pcoProperties, addPcoProperty, removePcoProperty } = store.export

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      return addPcoProperty({ pcname, pname })
    }
    removePcoProperty({ pcname, pname })
  }

  const checked =
    pcoProperties.filter((x) => x.pcname === pcname && x.pname === pname)
      .length > 0

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
        label={<div>{pname}</div>}
        className={label}
      />
    </div>
  )
})
