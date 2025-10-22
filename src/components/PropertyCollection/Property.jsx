import { useState, useContext } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import styled from '@emotion/styled'
import format from 'date-fns/format'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { onBlurDo } from './onBlur.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'

const Container = styled.div`
  margin: 5px 0;
`
const StyledFormControl = styled(FormControl)`
  width: 100%;
`
const StyledTextField = styled(TextField)`
  p {
    color: ${(props) => (props.error ? 'red' : 'rgba(0,0,0,0.54)')};
  }
`

export const Property = ({
  field,
  label,
  pC,
  helperText,
  type = 'text',
  disabled,
}) => {
  const apolloClient = useApolloClient()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const store = useContext(storeContext)
  const { scrollIntoView } = store

  const [value, setValue] = useState(pC[field] || '')
  const [error, setError] = useState(null)

  const onChange = (event) => setValue(event.target.value)
  const onBlur = (event) =>
    onBlurDo({
      apolloClient,
      queryClient,
      field,
      pC,
      value: event.target.value,
      prevValue: pC[field],
      setError,
      navigate,
      scrollIntoView,
    })

  return (
    <ErrorBoundary>
      <Container>
        <StyledFormControl
          error={!!error}
          variant="standard"
        >
          <StyledTextField
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
            multiline
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={!!disabled}
            type={type}
            helperText={
              error ? error
              : helperText ?
                helperText
              : ''
            }
            error={!!error}
            variant="standard"
          />
        </StyledFormControl>
      </Container>
    </ErrorBoundary>
  )
}
