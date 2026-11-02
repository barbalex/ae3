import { Item } from './Item'
import type { TaxProperty } from '../../../../../store'

type TaxPropertiesItemsProps = {
  taxProperties: TaxProperty[]
}

export const TaxPropertiesItems = ({
  taxProperties,
}: TaxPropertiesItemsProps) =>
  taxProperties.map((p) => (
    <Item
      key={`${p.taxname}: ${p.pname}`}
      properties={p}
    />
  ))
