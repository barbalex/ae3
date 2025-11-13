import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import TextField from '@mui/material/TextField'
import { format } from 'date-fns'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { onBlurLr } from './onBlurLr.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { storeContext } from '../../storeContext.js'

import { container } from './PropertyLr.module.css'

export const PropertyLr = observer(
  ({ taxonomy, field, label, type = 'text', disabled }) => {
    const apolloClient = useApolloClient()
    const queryClient = useQueryClient()
    const [value, setValue] = useState(taxonomy[field] || '')

    const store = useContext(storeContext)
    const { scrollIntoView } = store

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
      })

    return (
      <ErrorBoundary>
        <div className={container}>
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
  },
)
