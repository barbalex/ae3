import { useAtomValue } from 'jotai'

import { Comparator } from './Comparator.jsx'
import { Value } from './Value.jsx'
import { exportTaxFiltersAtom } from '../../../../../../jotaiStore/index.ts'
import { constants } from '../../../../../../modules/constants.js'

import styles from './index.module.css'

export const TaxField = ({ taxname, pname, jsontype }) => {
  const taxFilters = useAtomValue(exportTaxFiltersAtom)

  const exportTaxFilter = taxFilters.find(
    (x) => x.taxname === taxname && x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = exportTaxFilter

  return (
    <div className={styles.container}>
      <Value
        key={`${taxname}/${pname}/${jsontype}/${value}`}
        taxname={taxname}
        pname={pname}
        value={value}
        jsontype={jsontype}
        comparator={comparator}
      />
      {value !== undefined && value !== null && (
        <Comparator
          taxname={taxname}
          pname={pname}
          comparator={comparator}
          value={value}
        />
      )}
    </div>
  )
}
