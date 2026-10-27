import { createTheme } from '@mui/material/styles'
import { orange, green, red } from '@mui/material/colors'

import { constants } from './modules/constants.js'

// All the following keys are optional.
// We try our best to provide a great default value.
export const lightTheme = createTheme({
  palette: {
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: orange,
    secondary: green,
    error: {
      main: red[500],
    },
  },
  background: {
    default: '#fff9f1',
  },
  appBar: {
    height: constants.appBarHeight,
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: orange,
    secondary: green,
    error: {
      main: red[500],
    },
  },
  appBar: {
    height: constants.appBarHeight,
  },
})
