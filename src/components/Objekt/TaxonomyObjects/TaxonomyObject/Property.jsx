import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import updateObjectMutation from '../../updateObjectMutation.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { scrollIntoViewAtom } from '../../../../jotaiStore/index.ts'

import styles from './Property.module.css'

export const Property = ({ field, label, objekt, disabled, refetch }) => {
  const apolloClient = useApolloClient()
  const queryClient = useQueryClient()
  const [value, setValue] = useState(objekt?.[field] || '')

  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const onChange = (event) => setValue(event.target.value)
  const onBlur = async (event) => {
    if (!objekt?.id) return
    const { value } = event.target
    if (value !== 'prevValue') {
      await apolloClient.mutate({
        mutation: updateObjectMutation,
        variables: {
          name: value,
          id: objekt.id,
        },
      })
      refetch()
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
