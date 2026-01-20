import CircularProgress from '@mui/material/CircularProgress'

import styles from './Spinner.module.css'

export const Spinner = ({ message = 'lade Daten' }) => (
  <div className={styles.container}>
    <CircularProgress />
    <div className={styles.text}>{message}</div>
  </div>
)
