import { useAtomValue } from 'jotai'

import { PcoComparator } from './Comparator.jsx'
import { PcoValue } from './Value.jsx'
import { PcoCheckbox } from './Checkbox.jsx'
import { exportPcoFiltersAtom } from '../../../../../../../store/index.ts'

import styles from './index.module.css'

export const PcoProperty = ({ pcname, pname, jsontype }) => {
  const pcoFilters = useAtomValue(exportPcoFiltersAtom)

  const pcoFilter = pcoFilters.find(
    (x) => x.pcname === pcname && x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = pcoFilter

  if (jsontype === 'Boolean') {
    return (
      <div className={styles.container}>
        <PcoCheckbox
          pcname={pcname}
          pname={pname}
          value={value}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <PcoValue
        key={`${pcname}/${pname}/${jsontype}/${value}`}
        pcname={pcname}
        pname={pname}
        value={value}
        comparator={comparator}
        jsontype={jsontype}
      />
      {value !== undefined && value !== null && value !== ' ' && (
        <PcoComparator
          pcname={pcname}
          pname={pname}
          comparator={comparator}
          value={value}
        />
      )}
    </div>
  )
}
