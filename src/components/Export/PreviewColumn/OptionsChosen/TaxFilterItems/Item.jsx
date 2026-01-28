import { useAtom } from 'jotai'

import { booleanToJaNein } from '../../../../../modules/booleanToJaNein.js'
import { exportTaxFiltersAtom } from '../../../../../jotaiStore/index.ts'

import styles from './Item.module.css'

export const Item = ({ filter }) => {
  const [taxFilters, setTaxFilters] = useAtom(exportTaxFiltersAtom)

  const { taxname, pname, comparator, value } = filter
  const onClick = () => {
    setTaxFilters(
      taxFilters.filter((x) => !(x.taxname === taxname && x.pname === pname)),
    )
  }

  return (
    <li>
      {`${taxname}: ${pname} ${comparator ? `${comparator}` : ''}`}
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
