import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../storeContext.js'
import { reset } from './Item.module.css'

export const Item = observer(({ properties }) => {
  const store = useContext(storeContext)
  const { removePcoProperty } = store.export
  const { pcname, pname } = properties

  const onClick = () =>
    removePcoProperty({
      pcname,
      pname,
    })

  return (
    <li>
      {`${pcname}: ${pname}`}
      <span
        onClick={onClick}
        className={reset}
      >
        zurücksetzen
      </span>
    </li>
  )
})
