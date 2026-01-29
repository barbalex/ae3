import { useState } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import { format } from 'date-fns'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useSetAtom } from 'jotai'

import { onBlurDo } from './onBlur.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { scrollIntoViewAtom } from '../../store/index.ts'

import styles from './Property.module.css'

export const Property = ({
  field,
  label,
  pC,
  helperText,
  type = 'text',
  disabled,
  refetch,
}) => {
  const apolloClient = useApolloClient()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const [value, setValue] = useState(pC[field] || '')
  const [error, setError] = useState(null)

  const onChange = (event) => setValue(event.target.value)
  const onBlur = (event) =>
    onBlurDo({
      apolloClient,
      queryClient,
      field,
      pC,
      value: event.target.value,
      prevValue: pC[field],
      setError,
      navigate,
      scrollIntoView,
      refetch,
    })

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormControl
          error={!!error}
          variant="standard"
          className={styles.formControl}
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
            multiline
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={!!disabled}
            type={type}
            helperText={
              error ? error
              : helperText ?
                helperText
              : ''
            }
            error={!!error}
            variant="standard"
          />
        </FormControl>
      </div>
    </ErrorBoundary>
  )
}
