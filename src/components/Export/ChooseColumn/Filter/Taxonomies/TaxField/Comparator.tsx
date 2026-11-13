import { FilterComparator } from '../../FilterComparator'
import { exportTaxFiltersAtom } from '../../../../../../store'

type ComparatorProps = {
  comparator: string | null
  taxname: string
  pname: string
  value: string | number | null
}

export const Comparator = ({
  comparator,
  taxname,
  pname,
  value,
}: ComparatorProps) => (
  <FilterComparator
    fieldId={{ taxname, pname }}
    comparator={comparator}
    value={value}
    filtersAtom={exportTaxFiltersAtom}
    defaultComparator="ILIKE"
  />
)
