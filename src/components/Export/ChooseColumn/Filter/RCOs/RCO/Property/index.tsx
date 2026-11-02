import { useAtomValue } from 'jotai'

import { Comparator } from './Comparator'
import { Value } from './Value'
import { constants } from '../../../../../../../modules/constants'
import { exportRcoFiltersAtom } from '../../../../../../../store'

import styles from './index.module.css'

type PropertyProps = {
  pcname: string
  relationtype: string
  pname: string
  jsontype: string
}

export const Property = ({
  pcname,
  relationtype,
  pname,
  jsontype,
}: PropertyProps) => {
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
