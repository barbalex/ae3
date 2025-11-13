import CircularProgress from '@mui/material/CircularProgress'

import { container, text } from './Spinner.module.css'

export const Spinner = ({ message = 'lade Daten' }) => (
  <div className={container}>
    <CircularProgress />
    <div className={text}>{message}</div>
  </div>
)
