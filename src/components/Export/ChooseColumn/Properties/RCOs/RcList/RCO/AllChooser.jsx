import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../../storeContext.js'
import styles from './AllChooser.module.css'

export const AllChooser = observer(({ properties, relationtype }) => {
  const store = useContext(storeContext)
  const { rcoProperties, addRcoProperty, removeRcoProperty } = store.export

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      return properties.forEach(({ pcname, property }) =>
        addRcoProperty({ pcname, relationtype, pname: property }),
      )
    }
    removeRcoProperty({
      pcname: properties[0].pcname,
      relationtype,
      pname: properties[0].property,
    })
    properties.forEach(({ pcname, property }) => {
      removeRcoProperty({ pcname, relationtype, pname: property })
    })
  }

  const checkedArray = properties.map(
    (p) =>
      rcoProperties.filter(
        (x) =>
          x.pcname === p.pcname &&
          x.relationtype === relationtype &&
          x.pname === p.property,
      ).length > 0,
  )
  const checked = checkedArray.length > 0 && !checkedArray.includes(false)

  return (
    <div className={styles.container}>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checked}
            onChange={onCheck}
          />
        }
        label="alle"
        className={styles.label}
      />
    </div>
  )
})
