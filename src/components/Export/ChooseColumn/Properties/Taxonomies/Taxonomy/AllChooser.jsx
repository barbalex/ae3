import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { exportTaxPropertiesAtom } from '../../../../../../store/index.ts'
import styles from './AllChooser.module.css'

export const AllChooser = ({ properties }) => {
  const [taxProperties, setTaxProperties] = useAtom(exportTaxPropertiesAtom)

  const onCheck = async (event, isChecked) => {
    if (isChecked) {
      const propsToAdd = properties
        .map((p) => ({
          taxname: p.taxname ? p.taxname : p.taxonomyName,
          pname: p.propertyName,
        }))
        .filter(
          (p) =>
            !taxProperties.find(
              (x) => x.taxname === p.taxname && x.pname === p.pname,
            ),
        )
      setTaxProperties([...taxProperties, ...propsToAdd])
    } else {
      const pnames = properties.map((p) => p.propertyName)
      setTaxProperties(taxProperties.filter((x) => !pnames.includes(x.pname)))
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
}
