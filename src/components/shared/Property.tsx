import { useState } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { MdClear } from 'react-icons/md'
import { omit } from 'es-toolkit'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { apiFetch } from '../../modules/api'
import { ErrorBoundary } from './ErrorBoundary'
import { scrollIntoViewAtom } from '../../store'

import styles from './Property.module.css'

type PropertyProps = {
  id: string
  properties: Record<string, any>
  field: string
  refetch?: () => void
}

export const Property = ({ id, properties: propertiesPrevious, field: key, refetch }: PropertyProps) => {
    const queryClient = useQueryClient()
    const [value, setValue] = useState(propertiesPrevious[key] || '')

    const scrollIntoView = useSetAtom(scrollIntoViewAtom)

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value)

    const onBlur = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      const prevValue = propertiesPrevious[key]
      if (value !== prevValue) {
        const properties = {
          ...propertiesPrevious,
          ...{ [key]: value },
        }
        await apiFetch(`/object?id=eq.${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties }),
        })
        refetch?.()
        await queryClient.invalidateQueries({
          queryKey: ['tree'],
        })
        scrollIntoView()
      }
    }

    const onDelete = async () => {
      const properties = omit(propertiesPrevious, [key])
      await apiFetch(`/object?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      })
      refetch?.()
      queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
    }

    return (
      <ErrorBoundary>
        <div className={styles.container}>
          <TextField
            label={key}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            fullWidth
            multiline
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            variant="standard"
          />
          <IconButton
            title="Feld löschen"
            aria-label="Feld löschen"
            onClick={onDelete}
          >
            <MdClear color="error" />
          </IconButton>
        </div>
      </ErrorBoundary>
    )
}
