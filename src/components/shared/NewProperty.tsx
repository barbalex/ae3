import { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { apiFetch } from '../../modules/api'
import { ErrorBoundary } from './ErrorBoundary'
import { scrollIntoViewAtom } from '../../store'

import styles from './NewProperty.module.css'

type NewPropertyProps = {
  id: string
  properties: Record<string, any>
  refetch?: () => void
}

export const NewProperty = ({
  id,
  properties: propertiesPrevious,
  refetch,
}: NewPropertyProps) => {
  const queryClient = useQueryClient()

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')

  const onChangeLabel = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setLabel(event.target.value)
  const onChangeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValue(event.target.value)
  const onBlurValue = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target
    if (value !== null && value !== undefined && !!label) {
      const properties = {
        ...propertiesPrevious,
        ...{ [label]: value },
      }
      await apiFetch(`/object?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      })
      refetch?.()
      setLabel('')
      setValue('')
      await queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      scrollIntoView()
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <InputLabel>Neues Feld:</InputLabel>
        <div className={styles.fieldContainer}>
          <TextField
            label="Feld-Name"
            value={label}
            onChange={onChangeLabel}
            fullWidth
            multiline
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            variant="standard"
          />
          {!!label && (
            <TextField
              label="Feld-Wert"
              value={value}
              onChange={onChangeValue}
              onBlur={onBlurValue}
              fullWidth
              multiline
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              variant="standard"
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
