import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'
import ExportFlexed from './ExportFlexed'
import ExportStacked from './ExportStacked'

const ExportComponent = () => {
  const store = useContext(storeContext)
  const { stacked } = store

  return stacked ? <ExportStacked /> : <ExportFlexed />
}

export default observer(ExportComponent)
