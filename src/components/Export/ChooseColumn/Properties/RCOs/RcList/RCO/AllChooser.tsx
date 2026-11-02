import type { ChangeEvent } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { exportRcoPropertiesAtom } from '../../../../../../../store'
import styles from './AllChooser.module.css'

type AllChooserProps = {
  properties: any[]
  relationtype: string
}

export const AllChooser = ({ properties, relationtype }: AllChooserProps) => {
  const [rcoProperties, setRcoProperties] = useAtom(exportRcoPropertiesAtom)

  const onCheck = (event: ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
    if (isChecked) {
      const newProperties = properties
        .filter(
          (p) =>
            !rcoProperties.find(
              (x) =>
                x.pcname === p.pcname &&
                x.relationtype === relationtype &&
                x.pname === p.property,
            ),
        )
        .map((p) => ({ pcname: p.pcname, relationtype, pname: p.property }))
      setRcoProperties([...rcoProperties, ...newProperties])
    } else {
      const propertyPairs = properties.map((p) => ({
        pcname: p.pcname,
        pname: p.property,
      }))
      setRcoProperties(
        rcoProperties.filter(
          (x) =>
            !(
              x.relationtype === relationtype &&
              propertyPairs.some(
                (p) => p.pcname === x.pcname && p.pname === x.pname,
              )
            ),
        ),
      )
    }
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
}
