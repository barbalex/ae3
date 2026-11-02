import { Item } from './Item'
import type { PcoFilter } from '../../../../../store'

type PcoFilterItemsProps = {
  pcoFilters: PcoFilter[]
}

export const PcoFilterItems = ({ pcoFilters }: PcoFilterItemsProps) =>
  pcoFilters.map((f) => (
    <Item
      key={`${f.pcname}: ${f.pname}`}
      filter={f}
    />
  ))
