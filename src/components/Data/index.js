import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../../storeContext'
import DataFlexed from './DataFlexed'
import DataStacked from './DataStacked'

const DataComponent = () => {
  const store = useContext(storeContext)
  const { stacked } = store

  return stacked ? <DataStacked /> : <DataFlexed />
}

export default observer(DataComponent)
