import { useSetAtom } from 'jotai'

import { exportTaxPropertiesAtom } from '../../../../../store'
import type { TaxProperty } from '../../../../../store'
import styles from './Item.module.css'

type ItemProps = {
  properties: TaxProperty
}

export const Item = ({ properties }: ItemProps) => {
  const setTaxProperties = useSetAtom(exportTaxPropertiesAtom)
  const { taxname, pname } = properties
  const onClick = () =>
    setTaxProperties((prev) =>
      prev.filter((x) => !(x.taxname === taxname && x.pname === pname)),
    )

  return (
    <li key={`${taxname}: ${pname}`}>
      {`${taxname}: ${pname}`}
      <span
        onClick={onClick}
        className={styles.reset}
      >
        zurücksetzen
      </span>
    </li>
  )
}
