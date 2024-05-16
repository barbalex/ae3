import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext.js'
import ExportFlexed from './ExportFlexed.jsx'
import ExportStacked from './ExportStacked.jsx'

const ExportComponent = () => {
  const store = useContext(storeContext)
  const { stacked } = store

  return stacked ? <ExportStacked /> : <ExportFlexed />
}

export default observer(ExportComponent)
