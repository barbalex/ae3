import { Item } from './Item.jsx'

export const TaxPropertiesItems = ({ taxProperties }) =>
  taxProperties.map((p) => (
    <Item
      key={`${p.taxname}: ${p.pname}`}
      properties={p}
    />
  ))
