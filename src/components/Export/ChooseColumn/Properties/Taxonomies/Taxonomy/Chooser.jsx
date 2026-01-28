import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { exportTaxPropertiesAtom } from '../../../../../../jotaiStore/index.ts'
import styles from './Chooser.module.css'

export const Chooser = ({ taxname, pname, count }) => {
  const [taxProperties, setTaxProperties] = useAtom(exportTaxPropertiesAtom)

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      setTaxProperties([...taxProperties, { taxname, pname }])
    } else {
      setTaxProperties(
        taxProperties.filter(
          (x) => !(x.taxname === taxname && x.pname === pname),
        ),
      )
    }
  }

  const checked = taxProperties.filter((x) => x.pname === pname).length > 0

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
        label={
          <div>
            {pname}{' '}
            <span
              title="Anzahl Objekte"
              className={styles.countClass}
            >{`(${count} Objekte)`}</span>
          </div>
        }
        className={styles.label}
      />
    </div>
  )
}
