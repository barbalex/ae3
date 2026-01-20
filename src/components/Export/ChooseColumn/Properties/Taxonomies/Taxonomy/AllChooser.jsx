import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../storeContext.js'
import styles from './AllChooser.module.css'

export const AllChooser = observer(({ properties }) => {
  const store = useContext(storeContext)
  const { taxProperties, addTaxProperty, removeTaxProperty } = store.export

  const onCheck = async (event, isChecked) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const p of properties) {
      const taxname = p.taxname ? p.taxname : p.taxonomyName
      const pname = p.propertyName
      if (isChecked) {
        addTaxProperty({ taxname, pname })
      } else {
        removeTaxProperty({ taxname, pname })
      }
    }
  }

  const checkedArray = properties.map((p) => {
    const taxname = p.taxname ? p.taxname : p.taxonomyName
    return (
      taxProperties.filter(
        (x) => x.taxname === taxname && x.pname === p.propertyName,
      ).length > 0
    )
  })
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
