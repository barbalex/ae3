import { useAtomValue } from 'jotai'

import { stackedAtom } from '../../store'
import { ExportFlexed } from './ExportFlexed'
import { ExportStacked } from './ExportStacked'

export const Export = () => {
  const stacked = useAtomValue(stackedAtom)

  return stacked ? <ExportStacked /> : <ExportFlexed />
}
