import { useContext } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { observer } from 'mobx-react-lite'
import { useSetAtom, useAtomValue } from 'jotai'

import { storeContext } from '../../../../../../../storeContext.js'
import { exportPcoPropertiesAtom } from '../../../../../../../jotaiStore/index.ts'

import styles from './Checkbox.module.css'

export const PcoCheckbox = observer(({ pname, pcname, value }) => {
  const store = useContext(storeContext)
  const { addFilterFields, setPcoFilter } = store.export
  const pcoProperties = useAtomValue(exportPcoPropertiesAtom)
  const setPcoProperties = useSetAtom(exportPcoPropertiesAtom)

  const onChange = (e, val) => {
    let comparator = '='
    let value = val
    if (value === 'null') {
      comparator = null
      value = null
    }
    setPcoFilter({ pcname, pname, comparator, value })
    // if value and not chosen, choose
    if (addFilterFields) {
      if (
        !pcoProperties.find((t) => t.pcname === pcname && t.pname === pname)
      ) {
        setPcoProperties([...pcoProperties, { pcname, pname }])
      }
    }
  }

  return (
    <div className={styles.container}>
      <FormControl
        component="fieldset"
        variant="standard"
      >
        <FormLabel
          component="legend"
          className={styles.formLabel}
        >
          {pname}
        </FormLabel>
        <RadioGroup
          aria-label={pname}
          name={pname}
          value={value}
          onChange={onChange}
        >
          <FormControlLabel
            value="true"
            control={
              <Radio
                className={styles.radio}
                color="primary"
              />
            }
            label="Ja"
            className={styles.formControlLabel}
          />
          <FormControlLabel
            value="false"
            control={
              <Radio
                className={styles.radio}
                color="primary"
              />
            }
            label="Nein"
            className={styles.formControlLabel}
          />
          <FormControlLabel
            value="null"
            control={
              <Radio
                className={styles.radio}
                color="primary"
              />
            }
            label="nicht filtern"
            className={styles.formControlLabel}
          />
        </RadioGroup>
      </FormControl>
    </div>
  )
})
