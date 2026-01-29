import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useSetAtom, useAtomValue } from 'jotai'

import {
  exportPcoPropertiesAtom,
  exportPcoFiltersAtom,
  exportAddFilterFieldsAtom,
} from '../../../../../../../jotaiStore/index.ts'

import styles from './Checkbox.module.css'

export const PcoCheckbox = ({ pname, pcname, value }) => {
  const pcoProperties = useAtomValue(exportPcoPropertiesAtom)
  const setPcoProperties = useSetAtom(exportPcoPropertiesAtom)
  const pcoFilters = useAtomValue(exportPcoFiltersAtom)
  const setPcoFilters = useSetAtom(exportPcoFiltersAtom)
  const addFilterFields = useAtomValue(exportAddFilterFieldsAtom)

  const onChange = (e, val) => {
    let comparator = '='
    let value = val
    if (value === 'null') {
      comparator = null
      value = null
    }
    const pcoFilter = pcoFilters.find(
      (x) => x.pcname === pcname && x.pname === pname,
    )
    if (!comparator && !value && value !== 0) {
      // remove
      setPcoFilters(
        pcoFilters.filter((x) => !(x.pcname === pcname && x.pname === pname)),
      )
    } else if (!pcoFilter) {
      // add new one
      setPcoFilters([
        ...pcoFilters,
        {
          pcname,
          pname,
          comparator,
          value,
        },
      ])
    } else {
      // edit = replace existing
      setPcoFilters([
        ...pcoFilters.filter(
          (x) => !(x.pcname === pcname && x.pname === pname),
        ),
        {
          pcname,
          pname,
          comparator,
          value,
        },
      ])
    }
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
}
