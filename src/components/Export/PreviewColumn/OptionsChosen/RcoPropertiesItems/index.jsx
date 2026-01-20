import { Item } from './Item.jsx'

export const RcoPropertiesItems = ({ rcoProperties }) =>
  rcoProperties.map((p) => (
    <Item
      key={`${p.pcname}|${p.relationtype}|${p.pname}`}
      properties={p}
    />
  ))
