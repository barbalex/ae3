import { FilterValue } from '../../../FilterValue'
import {
  exportPcoFiltersAtom,
  exportPcoPropertiesAtom,
} from '../../../../../../../store'

type PcoValueProps = {
  pcname: string
  pname: string
  jsontype: string
  comparator: string | null
  value: string | number | null
}

export const PcoValue = ({
  pcname,
  pname,
  jsontype,
  comparator,
  value,
}: PcoValueProps) => (
  <FilterValue
    fieldId={{ pcname, pname }}
    pname={pname}
    jsontype={jsontype}
    comparator={comparator}
    value={value}
    rpcArgs={{
      table_name: 'property_collection_object',
      pc_field_name: 'property_collection_id',
      pc_table_name: 'property_collection',
      pc_name: pcname,
    }}
    filtersAtom={exportPcoFiltersAtom}
    propertiesAtom={exportPcoPropertiesAtom}
  />
)
