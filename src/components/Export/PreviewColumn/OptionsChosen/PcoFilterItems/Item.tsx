import { useSetAtom, useAtomValue } from 'jotai'

import { booleanToJaNein } from '../../../../../modules/booleanToJaNein'
import { exportPcoFiltersAtom } from '../../../../../store'
import type { PcoFilter } from '../../../../../store'

import styles from './Item.module.css'

type ItemProps = {
  filter: PcoFilter
}

export const Item = ({ filter }: ItemProps) => {
  const pcoFilters = useAtomValue(exportPcoFiltersAtom)
  const setPcoFilters = useSetAtom(exportPcoFiltersAtom)

  const { pcname, pname, comparator, value } = filter

  const onClick = () => {
    setPcoFilters(
      pcoFilters.filter(
        (x) => !(x.pcname === pcname && x.pname === pname),
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
