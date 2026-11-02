import { useState } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'
import TextField from '@mui/material/TextField'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { apiFetch } from '../../../../modules/api'
import { ErrorBoundary } from '../../../shared/ErrorBoundary'
import { scrollIntoViewAtom } from '../../../../store'

import styles from './Property.module.css'

type PropertyProps = {
  field: string
  label: string
  objekt?: any
  disabled?: boolean
  refetch?: () => void
}

export const Property = ({ field, label, objekt, disabled, refetch }: PropertyProps) => {
  const queryClient = useQueryClient()
  const [value, setValue] = useState(objekt?.[field] || '')

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue(event.target.value)
  const onBlur = async (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!objekt?.id) return
    const { value } = event.target
    if (value !== 'prevValue') {
      await apiFetch(`/object?id=eq.${objekt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      refetch?.()
      await queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      scrollIntoView()
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <TextField
          autoFocus={label === 'Name' && !value}
          label={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          multiline
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={!!disabled}
          variant="standard"
        />
      </div>
    </ErrorBoundary>
  )
}
