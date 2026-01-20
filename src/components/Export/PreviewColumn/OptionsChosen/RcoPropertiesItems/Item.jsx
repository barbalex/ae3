import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../storeContext.js'
import styles from './Item.module.css'

export const Item = observer(({ properties }) => {
  const { pcname, relationtype, pname } = properties
  const store = useContext(storeContext)
  const { removeRcoProperty } = store.export

  const onClick = () =>
    removeRcoProperty({
      pcname,
      relationtype,
      pname,
    })

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
})
