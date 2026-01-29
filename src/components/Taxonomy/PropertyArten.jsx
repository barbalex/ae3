import { useState } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { format } from 'date-fns'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { onBlurArten } from './onBlurArten.js'
import { scrollIntoViewAtom } from '../../store/index.ts'

import styles from './PropertyArten.module.css'

export const Property = ({
  taxonomy,
  field,
  label,
  type = 'text',
  disabled,
  refetch,
}) => {
  const apolloClient = useApolloClient()
  const queryClient = useQueryClient()

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const [value, setValue] = useState(taxonomy[field] || '')
  const onChange = (event) => setValue(event.target.value)

  const [fieldError, setFieldError] = useState()
  const onBlur = () =>
    onBlurArten({
      apolloClient,
      queryClient,
      scrollIntoView,
      field,
      taxonomy,
      value,
      prevValue: taxonomy[field],
      setFieldError,
      refetch,
    })

  return (
    <div className={styles.container}>
      <FormControl
        className={styles.formControl}
        fullWidth
        disabled={disabled}
        error={fieldError}
        aria-describedby={`${label}ErrorText`}
        variant="standard"
      >
        <TextField
          autoFocus={label === 'Name' && !value}
          label={label}
          value={
            field === 'lastUpdated' && value ?
              format(new Date(value), 'dd.MM.yyyy')
            : value
          }
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          multiline={type === 'number' ? false : true}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={!!disabled}
          type={type}
          variant="standard"
        />
        {!!fieldError && (
          <FormHelperText id={`${label}ErrorText`}>
            {fieldError?.message}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  )
}
