import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../storeContext.js'
import styles from './Item.module.css'

export const Item = observer(({ properties }) => {
  const store = useContext(storeContext)
  const { removeTaxProperty } = store.export

  const { taxname, pname } = properties
  const onClick = () =>
    removeTaxProperty({
      taxname,
      pname,
    })

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
})
