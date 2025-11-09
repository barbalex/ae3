import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { PcoComparator } from './Comparator.jsx'
import { PcoValue } from './Value.jsx'
import { PcoCheckbox } from './Checkbox.jsx'
import { storeContext } from '../../../../../../../storeContext.js'

import { container } from './index.module.css'

export const PcoProperty = observer(({ pcname, pname, jsontype }) => {
  const store = useContext(storeContext)
  const { pcoFilters: pcoFiltersPassed } = store.export
  const pcoFilters = getSnapshot(pcoFiltersPassed)

  const pcoFilter = pcoFilters.find(
    (x) => x.pcname === pcname && x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = pcoFilter

  if (jsontype === 'Boolean') {
    return (
      <div className={container}>
        <PcoCheckbox
          pcname={pcname}
          pname={pname}
          value={value}
        />
      </div>
    )
  }

  return (
    <div className={container}>
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
})
