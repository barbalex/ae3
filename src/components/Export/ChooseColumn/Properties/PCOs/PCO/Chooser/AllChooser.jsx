import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../../storeContext.js'
import { container, label } from './AllChooser.module.css'

export const AllChooser = observer(({ properties, pcName }) => {
  const store = useContext(storeContext)
  const { pcoProperties, addPcoProperty, removePcoProperty } = store.export

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      return properties.forEach((p) => {
        const pcname = pcName
        const pname = p.property
        addPcoProperty({ pcname, pname })
      })
    }
    properties.forEach((p) =>
      removePcoProperty({ pcname: pcName, pname: p.property }),
    )
  }

  const checkedArray = properties.map(
    (p) =>
      pcoProperties.filter((x) => x.pcname === pcName && x.pname === p.property)
        .length > 0,
  )
  const checked = checkedArray.length > 0 && !checkedArray.includes(false)

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
        label="alle"
        className={label}
      />
    </div>
  )
})
