import { FilterComparator } from '../../../FilterComparator'
import { exportPcoFiltersAtom } from '../../../../../../../store'

type PcoComparatorProps = {
  pcname: string
  pname: string
  value: string | number | null
  comparator: string | null
}

export const PcoComparator = ({
  pcname,
  pname,
  value,
  comparator,
}: PcoComparatorProps) => (
  <FilterComparator
    fieldId={{ pcname, pname }}
    comparator={comparator}
    value={value}
    filtersAtom={exportPcoFiltersAtom}
  />
)
