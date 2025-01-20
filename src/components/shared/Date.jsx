import React, { useCallback, useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { DateTime } from 'luxon'
import DatePicker from 'react-datepicker'
import styled from '@emotion/styled'

import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('de', de)
setDefaultLocale('de')

const StyledFormControl = styled(FormControl)`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  width: 100%;
  .react-datepicker-popper {
    z-index: 2;
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__header {
    background-color: rgba(74, 20, 140, 0.1) !important;
  }
`
const Label = styled(InputLabel)`
  font-size: 12px !important;
  color: rgb(0, 0, 0, 0.54);
  position: relative !important;
  transform: none !important;
`
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.25rem 0;
  background-color: #fff;
  background-clip: padding-box;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  background-color: transparent;
  font-size: 1rem;
  &:focus {
    color: #495057;
    background-color: #fff;
    outline: 0;
    border-bottom: 2px solid #4a148c;
    box-shadow: none;
    background-color: transparent;
  }
`
const dateFormat = [
  'dd.MM.yyyy',
  'd.MM.yyyy',
  'd.M.yyyy',
  'dd.M.yyyy',
  'dd.MM.yy',
  'd.MM.yy',
  'd.M.yy',
  'dd.M.yy',
  'd.M',
  'd.MM',
  'dd.M',
  'dd.MM',
  'd',
  'dd',
]

export const DateField = ({
  value: valuePassed,
  name,
  label,
  saveToDb,
  // error is not being used yet
  error,
  popperPlacement = 'bottom',
  helperText,
}) => {
  const [stateValue, setStateValue] = useState(valuePassed)
  useEffect(() => {
    setStateValue(valuePassed)
  }, [valuePassed])

  const onChangeDatePicker = useCallback(
    (date) => {
      const newValue =
        date === null ? null : DateTime.fromJSDate(date).toFormat('yyyy-LL-dd')
      setStateValue(newValue)
      saveToDb({
        target: {
          value: newValue,
          name,
        },
      })
    },
    [name, saveToDb],
  )

  const isValid = DateTime.fromSQL(stateValue).isValid
  const selected = isValid ? new Date(DateTime.fromSQL(stateValue)) : null

  // for popperPlacement see https://github.com/Hacker0x01/react-datepicker/issues/1246#issuecomment-361833919
  return (
    <StyledFormControl variant="standard">
      <Label htmlFor={name}>{label}</Label>
      <StyledDatePicker
        id={name}
        selected={selected}
        onChange={onChangeDatePicker}
        dateFormat={dateFormat}
        popperPlacement={popperPlacement}
      />
      {!!error && <FormHelperText>{error}</FormHelperText>}
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  )
}
