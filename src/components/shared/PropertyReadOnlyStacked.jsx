import React from 'react'
import TextField from '@mui/material/TextField'
import Linkify from 'react-linkify'
import styled from '@emotion/styled'

import ErrorBoundary from './ErrorBoundary.jsx'

const linkifyProperties = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
    cursor: 'pointer',
    textDecorationColor: 'rgba(0, 0, 0, 0.3)',
    textDecorationStyle: 'dotted',
  },
}
const Container = styled.div`
  padding: 0 0 5px 0;
  > span > div > div:after {
    height: 1px !important;
  }
`

export const PropertyReadOnlyStacked = ({ label, value }) => {
  let val = value
  if (val === true) val = 'ja'
  if (val === false) val = 'nein'

  return (
    <ErrorBoundary>
      <Container>
        <Linkify properties={linkifyProperties}>
          <TextField
            label={label}
            value={val}
            fullWidth
            multiline
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            variant="standard"
          />
        </Linkify>
      </Container>
    </ErrorBoundary>
  )
}
