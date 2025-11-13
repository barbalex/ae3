import CircularProgress from '@mui/material/CircularProgress'

import { node, icon } from './LoadingRow.module.css'

export const LoadingRow = ({ level }) => (
  <div
    className={node}
    style={{ paddingLeft: level * 17 - 5 }}
  >
    <CircularProgress className={icon} />
  </div>
)
