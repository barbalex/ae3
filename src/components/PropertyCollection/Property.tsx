import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useSetAtom } from 'jotai'

import { onBlurDo } from './onBlur'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { scrollIntoViewAtom } from '../../store'

import styles from './Property.module.css'

type PropertyProps = {
  field: string
  label: string
  // PostgREST row, dynamic
  pC: any
  helperText?: ReactNode
  type?: 'text' | 'number'
  disabled?: boolean
  refetch: () => void
}

export const Property = ({
  field,
  label,
  pC,
  helperText,
  type = 'text',
  disabled,
  refetch,
}: PropertyProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const [value, setValue] = useState(pC[field] || '')
  const [error, setError] = useState<string | null>(null)

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue(event.target.value)
  const onBlur = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onBlurDo({
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
