import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { exportRcoPropertiesAtom } from '../../../../../../../store/index.ts'
import styles from './Chooser.module.css'

export const Chooser = ({ pcname, relationtype, pname, propertiesLength }) => {
  const [rcoProperties, setRcoProperties] = useAtom(exportRcoPropertiesAtom)

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      if (
        !rcoProperties.find(
          (t) =>
            t.pcname === pcname &&
            t.relationtype === relationtype &&
            t.pname === pname,
        )
      ) {
        setRcoProperties([...rcoProperties, { pcname, relationtype, pname }])
      }
    } else {
      setRcoProperties(
        rcoProperties.filter(
          (x) =>
            !(
              x.pcname === pcname &&
              x.relationtype === relationtype &&
              x.pname === pname
            ),
        ),
      )
    }
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
}
