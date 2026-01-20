import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Comparator } from './Comparator.jsx'
import { Value } from './Value.jsx'
import { storeContext } from '../../../../../../storeContext.js'
import { constants } from '../../../../../../modules/constants.js'

import styles from './index.module.css'

export const TaxField = observer(({ taxname, pname, jsontype }) => {
  const store = useContext(storeContext)
  const { taxFilters } = store.export

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
})
