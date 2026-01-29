import { types } from 'mobx-state-tree'
import { constants } from '../../modules/constants.js'
import {
  jotaiStore,
  exportTaxPropertiesAtom,
  exportPcoPropertiesAtom,
  exportRcoPropertiesAtom,
  exportTaxFiltersAtom,
  exportPcoFiltersAtom,
  exportRcoFiltersAtom,
  exportWithSynonymDataAtom,
  exportTooManyPropertiesAtom,
  exportAddFilterFieldsAtom,
} from '../../jotaiStore/index.ts'

export default types.model('Export', {}).actions((self) => ({}))

export const defaultValue = {}
