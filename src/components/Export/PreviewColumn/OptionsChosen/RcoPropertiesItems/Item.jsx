import { useSetAtom } from 'jotai'

import { exportRcoPropertiesAtom } from '../../../../../jotaiStore/index.ts'
import styles from './Item.module.css'

export const Item = ({ properties }) => {
  const { pcname, relationtype, pname } = properties
  const setRcoProperties = useSetAtom(exportRcoPropertiesAtom)

  const onClick = () => {
    setRcoProperties((prev) =>
      prev.filter(
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
      {`${pcname} - ${relationtype}: ${pname}`}
      <span
        onClick={onClick}
        className={styles.reset}
      >
        zurücksetzen
      </span>
    </li>
  )
}
