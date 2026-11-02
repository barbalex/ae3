import { useState } from 'react'
import type { ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { onBlurLr } from './onBlurLr'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { scrollIntoViewAtom } from '../../store'

import styles from './PropertyLr.module.css'

type PropertyLrProps = {
  // PostgREST row, dynamic
  taxonomy: any
  field: string
  label: string
  type?: 'text' | 'number'
  disabled?: boolean
  refetch: () => void
}

export const PropertyLr = ({
  taxonomy,
  field,
  label,
  type = 'text',
  disabled,
  refetch,
}: PropertyLrProps) => {
  const queryClient = useQueryClient()
  const [value, setValue] = useState(taxonomy[field] || '')

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue(event.target.value)
  const onBlur = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onBlurLr({
      queryClient,
      scrollIntoView,
      field,
      taxonomy,
      value: event.target.value,
      prevValue: taxonomy[field],
      refetch,
    })

  return (
    <ErrorBoundary>
      <div className={styles.container}>
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
      </div>
    </ErrorBoundary>
  )
}
