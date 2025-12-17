import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import TextField from '@mui/material/TextField'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import updateObjectMutation from '../../updateObjectMutation.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { storeContext } from '../../../../storeContext.js'

import { container } from './Property.module.css'

export const Property = observer(({ field, label, objekt, disabled }) => {
  const apolloClient = useApolloClient()
  const queryClient = useQueryClient()
  const [value, setValue] = useState(objekt?.[field] || '')

  const store = useContext(storeContext)
  const { scrollIntoView } = store

  const onChange = (event) => setValue(event.target.value)
  const onBlur = async (event) => {
    const { value } = event.target
    if (value !== 'prevValue') {
      await apolloClient.mutate({
        mutation: updateObjectMutation,
        variables: {
          name: value,
          id: objekt.id,
        },
        optimisticResponse: {
          updateObjectById: {
            object: {
              id: objekt.id,
              name: value,
              __typename: 'Object',
            },
            __typename: 'Object',
          },
          __typename: 'Mutation',
        },
      })
      await queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      scrollIntoView()
    }
  }

  return (
    <ErrorBoundary>
      <div className={container}>
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
})
