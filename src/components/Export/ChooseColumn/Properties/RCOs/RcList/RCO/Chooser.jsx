import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../../storeContext.js'
import styles from './Chooser.module.css'

export const Chooser = observer(
  ({ pcname, relationtype, pname, propertiesLength }) => {
    const store = useContext(storeContext)
    const { rcoProperties, addRcoProperty, removeRcoProperty } = store.export

    const onCheck = (event, isChecked) => {
      if (isChecked) {
        return addRcoProperty({ pcname, relationtype, pname })
      }
      removeRcoProperty({ pcname, relationtype, pname })
    }

    const checked =
      rcoProperties.filter(
        (x) =>
          x.pcname === pcname &&
          x.relationtype === relationtype &&
          x.pname === pname,
      ).length > 0

    const containerWidth = propertiesLength === 1 ? 100 : 100 / propertiesLength

    return (
      <div style={{ width: `${containerWidth}%` }}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={checked}
              onChange={onCheck}
            />
          }
          label={<div>{pname}</div>}
          className={styles.label}
        />
      </div>
    )
  },
)
