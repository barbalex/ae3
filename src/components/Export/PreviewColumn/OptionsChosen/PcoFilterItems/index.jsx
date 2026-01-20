import { Item } from './Item.jsx'

export const PcoFilterItems = ({ pcoFilters }) =>
  pcoFilters.map((f) => (
    <Item
      key={`${f.pcname}: ${f.pname}`}
      filter={f}
    />
  ))
