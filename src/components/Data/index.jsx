import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext.js'
import { DataFlexed } from './DataFlexed.jsx'
import { DataStacked } from './DataStacked.jsx'

const DataComponent = () => {
  const store = useContext(storeContext)
  const { stacked } = store

  return stacked ? <DataStacked /> : <DataFlexed />
}

export default observer(DataComponent)
