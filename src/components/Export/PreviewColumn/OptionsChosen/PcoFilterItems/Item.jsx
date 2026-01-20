import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { booleanToJaNein } from '../../../../../modules/booleanToJaNein.js'
import { storeContext } from '../../../../../storeContext.js'

import styles from './Item.module.css'

export const Item = observer(({ filter }) => {
  const store = useContext(storeContext)
  const { setPcoFilter } = store.export

  const { pcname, pname, comparator, value } = filter

  const onClick = () =>
    setPcoFilter({
      pcname,
      pname,
      comparator: '',
      value: '',
    })

  return (
    <li>
      {`${pcname}: ${pname} ${comparator ? `${comparator}` : ''}`}
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
})
