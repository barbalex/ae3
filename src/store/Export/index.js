import { types } from 'mobx-state-tree'

import RcoFilter, { defaultValue as defaultRcoFilter } from './RcoFilter.js'
import { constants } from '../../modules/constants.js'
import {
  jotaiStore,
  exportTaxPropertiesAtom,
  exportPcoPropertiesAtom,
  exportRcoPropertiesAtom,
  exportTaxFiltersAtom,
  exportPcoFiltersAtom,
} from '../../jotaiStore/index.ts'

export default types
  .model('Export', {
    rcoFilters: types.optional(
      types.array(types.optional(RcoFilter, defaultRcoFilter)),
      [],
    ),
    withSynonymData: types.optional(types.boolean, true),
    tooManyProperties: types.optional(types.boolean, false), // TODO
    addFilterFields: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setWithSynonymData(value) {
      self.withSynonymData = value
    },
    setTooManyProperties(value) {
      self.tooManyProperties = value
    },
    setAddFilterFields(value) {
      self.addFilterFields = value
    },
    resetRcoFilters() {
      self.rcoFilters = []
    },
    setRcoFilters({ pcname, relationtype, pname, comparator, value }) {
      const rcoFilter = self.rcoFilters.find(
        (x) =>
          x.pcname === pcname &&
          x.relationtype === relationtype &&
          x.pname === pname,
      )
      if (!comparator && !value && value !== 0) {
        // remove
        self.rcoFilters = self.rcoFilters.filter(
          (x) =>
            !(
              x.pcname === pcname &&
              x.relationtype === relationtype &&
              x.pname === pname
            ),
        )
      } else if (!rcoFilter) {
        // add new one
        self.rcoFilters = [
          ...self.rcoFilters,
          {
            pcname,
            relationtype,
            pname,
            comparator,
            value,
          },
        ]
      } else {
        // edit = add new one instead of existing
        self.rcoFilters = [
          ...self.rcoFilters.filter(
            (x) =>
              !(
                x.pcname === pcname &&
                x.relationtype === relationtype &&
                x.pname === pname
              ),
          ),
          {
            pcname,
            relationtype,
            pname,
            comparator,
            value,
          },
        ]
      }
    },
  }))

export const defaultValue = {}
