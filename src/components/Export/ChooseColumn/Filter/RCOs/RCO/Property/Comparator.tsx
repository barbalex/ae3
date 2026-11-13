import { FilterComparator } from '../../../FilterComparator'
import { exportRcoFiltersAtom } from '../../../../../../../store'

type ComparatorProps = {
  relationtype: string
  pcname: string
  pname: string
  value: string | number | null
  comparator: string | null
}

export const Comparator = ({
  relationtype,
  pcname,
  pname,
  value,
  comparator,
}: ComparatorProps) => (
  <FilterComparator
    fieldId={{ pcname, relationtype, pname }}
    comparator={comparator}
    value={value}
    filtersAtom={exportRcoFiltersAtom}
  />
)
