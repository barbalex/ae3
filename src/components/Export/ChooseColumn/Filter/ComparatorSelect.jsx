import Input from '@mui/material/Input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import styles from './ComparatorSelect.module.css'

export const ComparatorSelect = ({ comparator, onChange }) => (
  <Select
    value={comparator}
    onChange={onChange}
    input={<Input id="v-op" />}
    className={styles.select}
  >
    <MenuItem value="ILIKE">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>enthalten</span>
        <span className={styles.comment}>Gross-Schreibung ignoriert</span>
      </div>
    </MenuItem>
    <MenuItem value="LIKE">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>enthalten</span>
        <span className={styles.comment}>Gross-Schreibung berücksichtigt</span>
      </div>
    </MenuItem>
    <MenuItem value="=">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>&#61;</span>
        <span className={styles.comment}>genau gleich</span>
      </div>
    </MenuItem>
    <MenuItem value=">">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>&#62;</span>
        <span className={styles.comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
    <MenuItem value=">=">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>&#62;&#61;</span>
        <span className={styles.comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
    <MenuItem value="<">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>&#60;</span>
        <span className={styles.comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
    <MenuItem value="<=">
      <div className={styles.menuItemRow}>
        <span className={styles.value}>&#60;&#61;</span>
        <span className={styles.comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
  </Select>
)
