import { useSetAtom } from 'jotai'

import { exportPcoPropertiesAtom } from '../../../../../store'
import type { PcoProperty } from '../../../../../store'
import styles from './Item.module.css'

type ItemProps = {
  properties: PcoProperty
}

export const Item = ({ properties }: ItemProps) => {
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
