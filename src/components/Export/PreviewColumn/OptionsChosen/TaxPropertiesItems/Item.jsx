import { useSetAtom } from 'jotai'

import { exportTaxPropertiesAtom } from '../../../../../store/index.ts'
import styles from './Item.module.css'

export const Item = ({ properties }) => {
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
