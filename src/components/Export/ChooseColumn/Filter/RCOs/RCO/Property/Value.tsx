import { FilterValue } from '../../../FilterValue'
import {
  exportRcoFiltersAtom,
  exportRcoPropertiesAtom,
} from '../../../../../../../store'

type ValueProps = {
  relationtype: string
  pcname: string
  pname: string
  jsontype: string
  comparator: string | null
  value: string | number | null
}

export const Value = ({
  relationtype,
  pcname,
  pname,
  jsontype,
  comparator,
  value,
}: ValueProps) => (
  <FilterValue
    fieldId={{ pcname, relationtype, pname }}
    pname={pname}
    jsontype={jsontype}
    comparator={comparator}
    value={value}
    rpcArgs={{
      table_name: 'relation',
      pc_field_name: 'property_collection_id',
      pc_table_name: 'property_collection',
      pc_name: pcname,
    }}
    filtersAtom={exportRcoFiltersAtom}
    propertiesAtom={exportRcoPropertiesAtom}
  />
)
