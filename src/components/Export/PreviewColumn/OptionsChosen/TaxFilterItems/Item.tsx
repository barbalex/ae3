import { useAtom } from 'jotai'

import { booleanToJaNein } from '../../../../../modules/booleanToJaNein'
import { exportTaxFiltersAtom } from '../../../../../store'
import type { TaxFilter } from '../../../../../store'

import styles from './Item.module.css'

type ItemProps = {
  filter: TaxFilter
}

export const Item = ({ filter }: ItemProps) => {
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
