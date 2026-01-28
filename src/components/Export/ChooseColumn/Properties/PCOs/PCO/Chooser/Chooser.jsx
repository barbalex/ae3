import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { exportPcoPropertiesAtom } from '../../../../../../../jotaiStore/index.ts'
import { constants } from '../../../../../../../modules/constants.js'

import styles from './Chooser.module.css'

export const Chooser = ({ pcname, pname }) => {
  const [pcoProperties, setPcoProperties] = useAtom(exportPcoPropertiesAtom)

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      if (
        !pcoProperties.find((t) => t.pcname === pcname && t.pname === pname)
      ) {
        setPcoProperties([...pcoProperties, { pcname, pname }])
      }
    } else {
      setPcoProperties(
        pcoProperties.filter(
          (x) => !(x.pcname === pcname && x.pname === pname),
        ),
      )
    }
  }

  const checked =
    pcoProperties.filter((x) => x.pcname === pcname && x.pname === pname)
      .length > 0

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
        label={<div>{pname}</div>}
        className={styles.label}
      />
    </div>
  )
}
