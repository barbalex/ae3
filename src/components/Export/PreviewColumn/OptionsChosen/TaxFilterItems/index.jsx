import { Item } from './Item.jsx'

export const TaxFilterItems = ({ taxFilters }) =>
  taxFilters.map((f) => (
    <Item
      key={`${f.taxname}: ${f.pname}`}
      filter={f}
    />
  ))
