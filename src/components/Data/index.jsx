import { useAtomValue } from 'jotai'

import { stackedAtom } from '../../store/index.ts'
import { DataFlexed } from './DataFlexed.jsx'
import { DataStacked } from './DataStacked.jsx'

export const Data = () => {
  const stacked = useAtomValue(stackedAtom)

  return stacked ? <DataStacked /> : <DataFlexed />
}
