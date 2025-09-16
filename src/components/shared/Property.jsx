import { useState, useCallback, memo, useContext } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdClear } from 'react-icons/md'
import styled from '@emotion/styled'
import { omit } from 'es-toolkit'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { updatePropertyMutation } from './updatePropertyMutation.js'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'

const Container = styled.div`
  margin: 12px 10px 12px 2px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`
const DeleteButton = styled(IconButton)`
  :hover {
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.12);
    text-decoration: none;
  }
`

export const Property = memo(
  ({ id, properties: propertiesPrevious, field: key }) => {
    const apolloClient = useApolloClient()
    const queryClient = useQueryClient()
    const [value, setValue] = useState(propertiesPrevious[key] || '')

    const store = useContext(storeContext)
    const { scrollIntoView } = store

    const onChange = useCallback((event) => {
      setValue(event.target.value)
    }, [])
    const onBlur = useCallback(
      async (event) => {
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
          await queryClient.invalidateQueries({
            queryKey: ['tree'],
          })
          scrollIntoView()
        }
      },
      [propertiesPrevious, key, apolloClient, id],
    )
    const onDelete = useCallback(async () => {
      const properties = omit(propertiesPrevious, key)
      await apolloClient.mutate({
        mutation: updatePropertyMutation,
        variables: { properties: JSON.stringify(properties), id },
      })
      queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
    }, [propertiesPrevious, key, apolloClient, id])

    return (
      <ErrorBoundary>
        <Container>
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
          <DeleteButton
            title="Feld löschen"
            aria-label="Feld löschen"
            onClick={onDelete}
          >
            <Icon>
              <MdClear color="error" />
            </Icon>
          </DeleteButton>
        </Container>
      </ErrorBoundary>
    )
  },
)
