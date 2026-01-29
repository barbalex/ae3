import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { format } from 'date-fns'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { onBlurLr } from './onBlurLr.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { scrollIntoViewAtom } from '../../jotaiStore/index.ts'

import styles from './PropertyLr.module.css'

export const PropertyLr = ({
  taxonomy,
  field,
  label,
  type = 'text',
  disabled,
  refetch,
}) => {
  const apolloClient = useApolloClient()
  const queryClient = useQueryClient()
  const [value, setValue] = useState(taxonomy[field] || '')

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const onChange = (event) => setValue(event.target.value)
  const onBlur = (event) =>
    onBlurLr({
      apolloClient,
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
