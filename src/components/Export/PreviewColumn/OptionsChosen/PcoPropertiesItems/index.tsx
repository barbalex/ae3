import { Item } from './Item'
import type { PcoProperty } from '../../../../../store'

type PcoPropertiesItemsProps = {
  pcoProperties: PcoProperty[]
}

export const PcoPropertiesItems = ({
  pcoProperties,
}: PcoPropertiesItemsProps) =>
  pcoProperties.map((p) => (
    <Item
      key={`${p.pcname}: ${p.pname}`}
      properties={p}
    />
  ))
