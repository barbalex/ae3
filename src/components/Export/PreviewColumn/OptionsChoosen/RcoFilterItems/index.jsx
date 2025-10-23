import { Item } from './Item.jsx'

export const RcoFilterItems = ({ rcoFilters }) =>
  rcoFilters.map((f) => (
    <Item
      key={`${f.pcname}|${f.relationtype}|${f.pname}`}
      filter={f}
    />
  ))
