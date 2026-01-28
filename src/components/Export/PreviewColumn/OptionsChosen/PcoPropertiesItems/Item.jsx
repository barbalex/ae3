import { useSetAtom } from 'jotai'

import { exportPcoPropertiesAtom } from '../../../../../jotaiStore/index.ts'
import styles from './Item.module.css'

export const Item = ({ properties }) => {
  const setPcoProperties = useSetAtom(exportPcoPropertiesAtom)
  const { pcname, pname } = properties

  const onClick = () => {
    setPcoProperties((prev) =>
      prev.filter((x) => !(x.pcname === pcname && x.pname === pname)),
    )
  }

  return (
    <li>
      {`${pcname}: ${pname}`}
      <span
        onClick={onClick}
        className={styles.reset}
      >
        zurücksetzen
      </span>
    </li>
  )
}
