import { types } from 'mobx-state-tree'

import RcoProperty, {
  defaultValue as defaultRcoProperty,
} from './RcoProperty.js'
import TaxFilter, { defaultValue as defaultTaxFilter } from './TaxFilter.js'
import PcoFilter, { defaultValue as defaultPcoFilter } from './PcoFilter.js'
import RcoFilter, { defaultValue as defaultRcoFilter } from './RcoFilter.js'
import { constants } from '../../modules/constants.js'
import {
  jotaiStore,
  exportTaxPropertiesAtom,
  exportPcoPropertiesAtom,
} from '../../jotaiStore/index.ts'

export default types
  .model('Export', {
    rcoProperties: types.optional(
      types.array(types.optional(RcoProperty, defaultRcoProperty)),
      [],
    ),
    taxFilters: types.optional(
      types.array(types.optional(TaxFilter, defaultTaxFilter)),
      [],
    ),
    pcoFilters: types.optional(
      types.array(types.optional(PcoFilter, defaultPcoFilter)),
      [],
    ),
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
    resetPcoFilters() {
      self.pcoFilters = []
    },
    setPcoFilter({ pcname, pname, comparator, value }) {
      const pcoFilter = self.pcoFilters.find(
        (x) => x.pcname === pcname && x.pname === pname,
      )
      if (!comparator && !value && value !== 0) {
        // remove
        self.pcoFilters = self.pcoFilters.filter(
          (x) => !(x.pcname === pcname && x.pname === pname),
        )
      } else if (!pcoFilter) {
        // add new one
        self.pcoFilters = [
          ...self.pcoFilters,
          {
            pcname,
            pname,
            comparator,
            value,
          },
        ]
      } else {
        // edit = add new one instead of existing
        self.pcoFilters = [
          ...self.pcoFilters.filter(
            (x) => !(x.pcname === pcname && x.pname === pname),
          ),
          {
            pcname,
            pname,
            comparator,
            value,
          },
        ]
      }
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
    resetRcoProperties() {
      self.rcoProperties = []
    },
    removeRcoProperty({ pcname, relationtype, pname }) {
      self.rcoProperties = self.rcoProperties.filter(
        (x) =>
          !(
            x.pcname === pcname &&
            x.relationtype === relationtype &&
            x.pname === pname
          ),
      )
    },
    addRcoProperty({ pcname, relationtype, pname }) {
      const taxProperties = jotaiStore.get(exportTaxPropertiesAtom)
      const pcoProperties = jotaiStore.get(exportPcoPropertiesAtom)
      const nrOfPropertiesExported =
        taxProperties.length + self.rcoProperties.length + pcoProperties.length
      if (nrOfPropertiesExported > constants.export.maxFields) {
        self.tooManyProperties = true
      } else {
        // only add if not yet done
        const rcoProperty = self.rcoProperties.find(
          (t) =>
            t.pcname === pcname &&
            t.relationtype === relationtype &&
            t.pname === pname,
        )
        if (!rcoProperty) {
          const rcoProperties = [
            ...self.rcoProperties,
            {
              pcname,
              relationtype,
              pname,
            },
          ]
          self.rcoProperties = rcoProperties
        }
      }
    },
    resetTaxFilters() {
      self.taxFilters = []
    },
    setTaxFilters({ taxname, pname, comparator, value }) {
      const taxFilter = self.taxFilters.find(
        (x) => x.taxname === taxname && x.pname === pname,
      )
      if (!comparator && !value && value !== 0) {
        // remove
        self.taxFilters = self.taxFilters.filter(
          (x) => !(x.taxname === taxname && x.pname === pname),
        )
      } else if (!taxFilter) {
        // add new one
        self.taxFilters = [
          ...self.taxFilters,
          {
            taxname,
            pname,
            comparator,
            value,
          },
        ]
      } else {
        // edit = add new one instead of existing
        self.taxFilters = [
          ...self.taxFilters.filter(
            (x) => !(x.taxname === taxname && x.pname === pname),
          ),
          {
            taxname,
            pname,
            comparator,
            value,
          },
        ]
      }
    },
  }))

export const defaultValue = {}
