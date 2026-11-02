import { Item } from './Item'
import type { TaxFilter } from '../../../../../store'

type TaxFilterItemsProps = {
  taxFilters: TaxFilter[]
}

export const TaxFilterItems = ({ taxFilters }: TaxFilterItemsProps) =>
  taxFilters.map((f) => (
    <Item
      key={`${f.taxname}: ${f.pname}`}
      filter={f}
    />
  ))
