import { Item } from './Item.jsx'

export const PcoPropertiesItems = ({ pcoProperties }) =>
  pcoProperties.map((p) => (
    <Item
      key={`${p.pcname}: ${p.pname}`}
      properties={p}
    />
  ))
