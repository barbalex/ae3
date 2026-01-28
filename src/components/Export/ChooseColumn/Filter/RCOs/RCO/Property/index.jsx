import { useAtomValue } from 'jotai'

import { Comparator } from './Comparator.jsx'
import { Value } from './Value.jsx'
import { constants } from '../../../../../../../modules/constants.js'
import { exportRcoFiltersAtom } from '../../../../../../../jotaiStore/index.ts'

import styles from './index.module.css'

export const Property = ({ pcname, relationtype, pname, jsontype }) => {
  const rcoFilters = useAtomValue(exportRcoFiltersAtom)

  const exportRcoFilter = rcoFilters.find(
    (x) =>
      x.pcname === pcname &&
      x.relationtype === relationtype &&
      x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = exportRcoFilter

  return (
    <div className={styles.container}>
      <Value
        key={`${pcname}/${pname}/${jsontype}/${value}`}
        pcname={pcname}
        relationtype={relationtype}
        pname={pname}
        value={value}
        comparator={comparator}
        jsontype={jsontype}
      />
      {value !== undefined && value !== null && (
        <Comparator
          pcname={pcname}
          relationtype={relationtype}
          pname={pname}
          comparator={comparator}
          value={value}
        />
      )}
    </div>
  )
}
