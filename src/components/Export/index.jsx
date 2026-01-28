import { useAtomValue } from 'jotai'

import { stackedAtom } from '../../jotaiStore/index.ts'
import { ExportFlexed } from './ExportFlexed.jsx'
import { ExportStacked } from './ExportStacked.jsx'

export const Export = () => {
  const stacked = useAtomValue(stackedAtom)

  return stacked ? <ExportStacked /> : <ExportFlexed />
}
