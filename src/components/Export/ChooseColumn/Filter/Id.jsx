import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { useSetAtom } from 'jotai'

import { exportIdsAtom } from '../../../../jotaiStore/index.ts'
import styles from './Id.module.css'

export const Id = () => {
  const setExportIds = useSetAtom(exportIdsAtom)

  const [value, setValue] = useState('')

  const handleChange = (event) => {
    const { value } = event.target
    setValue(value)
    // convert values into an array of values, separated by commas
    //const valueForStore = value ? JSON.parse(`"[${event.target.value}]"`) : []
    const valueForStore =
      value ? event.target.value.replace(/\s/g, '').split(',') : []
    setExportIds(valueForStore)
  }

  return (
    <TextField
      id="id"
      label="id"
      multiline
      maxRows="5"
      value={value}
      onChange={handleChange}
      margin="normal"
      fullWidth
      helperText="Sie können mehrere id's kommagetrennt einfügen"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      variant="standard"
      className={styles.field}
    />
  )
}
