import { Item } from './Item'
import type { RcoFilter } from '../../../../../store'

type RcoFilterItemsProps = {
  rcoFilters: RcoFilter[]
}

export const RcoFilterItems = ({ rcoFilters }: RcoFilterItemsProps) =>
  rcoFilters.map((f) => (
    <Item
      key={`${f.pcname}|${f.relationtype}|${f.pname}`}
      filter={f}
    />
  ))
