import { useSetAtom } from 'jotai'

import { exportRcoPropertiesAtom } from '../../../../../store'
import type { RcoProperty } from '../../../../../store'
import styles from './Item.module.css'

type ItemProps = {
  properties: RcoProperty
}

export const Item = ({ properties }: ItemProps) => {
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
