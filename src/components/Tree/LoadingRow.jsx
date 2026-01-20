import CircularProgress from '@mui/material/CircularProgress'

import styles from './LoadingRow.module.css'

export const LoadingRow = ({ level }) => (
  <div
    className={styles.node}
    style={{ paddingLeft: level * 17 - 5 }}
  >
    <CircularProgress className={styles.icon} />
  </div>
)
