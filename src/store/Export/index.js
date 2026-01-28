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
} from '../../jotaiStore/index.ts'

export default types
  .model('Export', {
    tooManyProperties: types.optional(types.boolean, false), // TODO
    addFilterFields: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setTooManyProperties(value) {
      self.tooManyProperties = value
    },
    setAddFilterFields(value) {
      self.addFilterFields = value
    },
  }))

export const defaultValue = {}
