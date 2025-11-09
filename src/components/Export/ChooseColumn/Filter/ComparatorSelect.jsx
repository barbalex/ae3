import Input from '@mui/material/Input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {
  select,
  menuItemRow,
  value,
  comment,
} from './ComparatorSelect.module.css'

export const ComparatorSelect = ({ comparator, onChange }) => (
  <Select
    value={comparator}
    onChange={onChange}
    input={<Input id="v-op" />}
    className={select}
  >
    <MenuItem value="ILIKE">
      <div className={menuItemRow}>
        <span className={value}>enthalten</span>
        <span className={comment}>Gross-Schreibung ignoriert</span>
      </div>
    </MenuItem>
    <MenuItem value="LIKE">
      <div className={menuItemRow}>
        <span className={value}>enthalten</span>
        <span className={comment}>Gross-Schreibung berücksichtigt</span>
      </div>
    </MenuItem>
    <MenuItem value="=">
      <div className={menuItemRow}>
        <span className={value}>&#61;</span>
        <span className={comment}>genau gleich</span>
      </div>
    </MenuItem>
    <MenuItem value=">">
      <div className={menuItemRow}>
        <span className={value}>&#62;</span>
        <span className={comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
    <MenuItem value=">=">
      <div className={menuItemRow}>
        <span className={value}>&#62;&#61;</span>
        <span className={comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
    <MenuItem value="<">
      <div className={menuItemRow}>
        <span className={value}>&#60;</span>
        <span className={comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
    <MenuItem value="<=">
      <div className={menuItemRow}>
        <span className={value}>&#60;&#61;</span>
        <span className={comment}>(Zahlen wie Text sortiert)</span>
      </div>
    </MenuItem>
  </Select>
)
