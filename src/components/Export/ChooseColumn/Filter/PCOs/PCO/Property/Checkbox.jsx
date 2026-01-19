import { useContext } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../../storeContext.js'

import {
  container,
  formLabel,
  formControlLabel,
  radio,
} from './Checkbox.module.css'

export const PcoCheckbox = observer(({ pname, pcname, value }) => {
  const store = useContext(storeContext)
  const { addFilterFields, setPcoFilter, addPcoProperty } = store.export

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
      addPcoProperty({ pcname, pname })
    }
  }

  return (
    <div className={container}>
      <FormControl
        component="fieldset"
        variant="standard"
      >
        <FormLabel
          component="legend"
          className={formLabel}
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
                className={radio}
                color="primary"
              />
            }
            label="Ja"
            className={formControlLabel}
          />
          <FormControlLabel
            value="false"
            control={
              <Radio
                className={radio}
                color="primary"
              />
            }
            label="Nein"
            className={formControlLabel}
          />
          <FormControlLabel
            value="null"
            control={
              <Radio
                className={radio}
                color="primary"
              />
            }
            label="nicht filtern"
            className={formControlLabel}
          />
        </RadioGroup>
      </FormControl>
    </div>
  )
})
