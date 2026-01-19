import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { MdClear } from 'react-icons/md'
import { omit } from 'es-toolkit'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { updatePropertyMutation } from './updatePropertyMutation.js'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import { storeContext } from '../../storeContext.js'

import { container } from './Property.module.css'

export const Property = observer(
  ({ id, properties: propertiesPrevious, field: key, refetch }) => {
    const apolloClient = useApolloClient()
    const queryClient = useQueryClient()
    const [value, setValue] = useState(propertiesPrevious[key] || '')

    const store = useContext(storeContext)
    const { scrollIntoView } = store

    const onChange = (event) => setValue(event.target.value)

    const onBlur = async (event) => {
      const { value } = event.target
      const prevValue = propertiesPrevious[key]
      if (value !== prevValue) {
        const properties = {
          ...propertiesPrevious,
          ...{ [key]: value },
        }
        await apolloClient.mutate({
          mutation: updatePropertyMutation,
          variables: { properties: JSON.stringify(properties), id },
          optimisticResponse: {
            updateObjectById: {
              object: {
                id,
                properties: JSON.stringify(properties),
                __typename: 'Object',
              },
              __typename: 'Object',
            },
            __typename: 'Mutation',
          },
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
      await apolloClient.mutate({
        mutation: updatePropertyMutation,
        variables: { properties: JSON.stringify(properties), id },
      })
      refetch?.()
      queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
    }

    return (
      <ErrorBoundary>
        <div className={container}>
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
  },
)
