import { useAtomValue } from 'jotai'

import { stackedAtom } from '../../store'
import { ExportFlexed } from './ExportFlexed'
import { ExportStacked } from './ExportStacked'
import { useExportUrlSync } from './useExportUrlSync'

export const Export = () => {
  useExportUrlSync()

  const stacked = useAtomValue(stackedAtom)

  return stacked ? <ExportStacked /> : <ExportFlexed />
}
