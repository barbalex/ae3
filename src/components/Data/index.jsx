import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../storeContext.js'
import { DataFlexed } from './DataFlexed.jsx'
import { DataStacked } from './DataStacked.jsx'

export const Data = observer(() => {
  const store = useContext(storeContext)
  const { stacked } = store

  return stacked ? <DataStacked /> : <DataFlexed />
})
