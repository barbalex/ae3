import { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { updatePropertyMutation } from './updatePropertyMutation.js'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import { scrollIntoViewAtom } from '../../store/index.ts'

import styles from './NewProperty.module.css'

export const NewProperty = ({
  id,
  properties: propertiesPrevious,
  refetch,
}) => {
  const apolloClient = useApolloClient()
  const queryClient = useQueryClient()

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')

  const onChangeLabel = (event) => setLabel(event.target.value)
  const onChangeValue = (event) => setValue(event.target.value)
  const onBlurValue = async (event) => {
    const { value } = event.target
    if (value !== null && value !== undefined && !!label) {
      const properties = {
        ...propertiesPrevious,
        ...{ [label]: value },
      }
      await apolloClient.mutate({
        mutation: updatePropertyMutation,
        variables: { properties: JSON.stringify(properties), id },
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
