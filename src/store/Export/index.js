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
} from '../../jotaiStore/index.ts'

export default types
  .model('Export', {
    addFilterFields: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setAddFilterFields(value) {
      self.addFilterFields = value
    },
  }))

export const defaultValue = {}
