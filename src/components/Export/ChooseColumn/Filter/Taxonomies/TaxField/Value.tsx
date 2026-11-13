import { FilterValue } from '../../FilterValue'
import {
  exportTaxFiltersAtom,
  exportTaxPropertiesAtom,
} from '../../../../../../store'

type ValueProps = {
  taxname: string
  pname: string
  jsontype: string
  comparator: string | null
  value: string | number | null
}

export const Value = ({
  taxname,
  pname,
  jsontype,
  comparator,
  value,
}: ValueProps) => (
  <FilterValue
    fieldId={{ taxname, pname }}
    pname={pname}
    jsontype={jsontype}
    comparator={comparator}
    value={value}
    rpcArgs={{
      table_name: 'object',
      pc_field_name: 'taxonomy_id',
      pc_table_name: 'taxonomy',
      pc_name: taxname,
    }}
    filtersAtom={exportTaxFiltersAtom}
    propertiesAtom={exportTaxPropertiesAtom}
    checkMaxFields
  />
)
