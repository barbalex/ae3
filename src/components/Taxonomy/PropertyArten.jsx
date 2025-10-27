import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { onBlurArten } from './onBlurArten.js'
import { storeContext } from '../../storeContext.js'

const Container = styled.div`
  margin: 5px 0;
`
const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

export const Property = observer(
  ({ taxonomy, field, label, type = 'text', disabled }) => {
    const apolloClient = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(storeContext)
    const { scrollIntoView } = store

    const [value, setValue] = useState(taxonomy[field] || '')
    const onChange = (event) => setValue(event.target.value)

    const [fieldError, setFieldError] = useState()
    const onBlur = () =>
      onBlurArten({
        apolloClient,
        queryClient,
        scrollIntoView,
        field,
        taxonomy,
        value,
        prevValue: taxonomy[field],
        setFieldError,
      })

    return (
      <Container>
        <StyledFormControl
          fullWidth
          disabled={disabled}
          error={fieldError}
          aria-describedby={`${label}ErrorText`}
          variant="standard"
        >
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
          {!!fieldError && (
            <FormHelperText id={`${label}ErrorText`}>
              {fieldError?.message}
            </FormHelperText>
          )}
        </StyledFormControl>
      </Container>
    )
  },
)
