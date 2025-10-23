import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../storeContext.js'
import { ExportFlexed } from './ExportFlexed.jsx'
import { ExportStacked } from './ExportStacked.jsx'

export const Export = observer(() => {
  const store = useContext(storeContext)
  const { stacked } = store

  return stacked ? <ExportStacked /> : <ExportFlexed />
})
