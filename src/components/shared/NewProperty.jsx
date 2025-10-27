import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { updatePropertyMutation } from './updatePropertyMutation.js'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import { storeContext } from '../../storeContext.js'

const Container = styled.div`
  margin: 20px 10px 12px 0;
`
const FieldContainer = styled.div`
  width: 100%;
  display: flex;
`

export const NewProperty = observer(
  ({ id, properties: propertiesPrevious }) => {
    const apolloClient = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(storeContext)
    const { scrollIntoView } = store

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
        <Container>
          <InputLabel>Neues Feld:</InputLabel>
          <FieldContainer>
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
          </FieldContainer>
        </Container>
      </ErrorBoundary>
    )
  },
)
