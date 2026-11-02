import { useAtomValue } from 'jotai'

import { stackedAtom } from '../../store'
import { DataFlexed } from './DataFlexed'
import { DataStacked } from './DataStacked'

export const Data = () => {
  const stacked = useAtomValue(stackedAtom)

  return stacked ? <DataStacked /> : <DataFlexed />
}
