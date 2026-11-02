import { Item } from './Item'
import type { RcoProperty } from '../../../../../store'

type RcoPropertiesItemsProps = {
  rcoProperties: RcoProperty[]
}

export const RcoPropertiesItems = ({
  rcoProperties,
}: RcoPropertiesItemsProps) =>
  rcoProperties.map((p) => (
    <Item
      key={`${p.pcname}|${p.relationtype}|${p.pname}`}
      properties={p}
    />
  ))
