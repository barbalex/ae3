import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { exportPcoPropertiesAtom } from '../../../../../../../jotaiStore/index.ts'
import styles from './AllChooser.module.css'

export const AllChooser = ({ properties, pcName }) => {
  const [pcoProperties, setPcoProperties] = useAtom(exportPcoPropertiesAtom)

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      const newProperties = properties
        .filter(
          (p) =>
            !pcoProperties.find(
              (x) => x.pcname === pcName && x.pname === p.property,
            ),
        )
        .map((p) => ({ pcname: pcName, pname: p.property }))
      setPcoProperties([...pcoProperties, ...newProperties])
    } else {
      const propertyNames = properties.map((p) => p.property)
      setPcoProperties(
        pcoProperties.filter(
          (x) => !(x.pcname === pcName && propertyNames.includes(x.pname)),
        ),
      )
    }
  }

  const checkedArray = properties.map(
    (p) =>
      pcoProperties.filter((x) => x.pcname === pcName && x.pname === p.property)
        .length > 0,
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
}
