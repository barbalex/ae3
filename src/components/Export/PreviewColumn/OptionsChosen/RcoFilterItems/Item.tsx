import { useSetAtom, useAtomValue } from 'jotai'

import { booleanToJaNein } from '../../../../../modules/booleanToJaNein'
import { exportRcoFiltersAtom } from '../../../../../store'
import type { RcoFilter } from '../../../../../store'

import styles from './Item.module.css'

type ItemProps = {
  filter: RcoFilter
}

export const Item = ({ filter }: ItemProps) => {
  const { pcname, relationtype, pname, comparator, value } = filter
  const rcoFilters = useAtomValue(exportRcoFiltersAtom)
  const setRcoFilters = useSetAtom(exportRcoFiltersAtom)

  const onClick = () => {
    setRcoFilters(
      rcoFilters.filter(
        (x) =>
          !(
            x.pcname === pcname &&
            x.relationtype === relationtype &&
            x.pname === pname
          ),
      ),
    )
  }

  return (
    <li>
      {`${pcname}: ${pname} ${comparator ? `${comparator}` : ''}`}
      <span className={styles.filterValue}>
        {typeof value === 'boolean' ? booleanToJaNein(value) : value}
      </span>
      <span
        onClick={onClick}
        className={styles.reset}
      >
        zurücksetzen
      </span>
    </li>
  )
}
