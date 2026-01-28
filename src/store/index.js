import { types } from 'mobx-state-tree'
import { isEqual } from 'es-toolkit'

import Export, { defaultValue as defaultExport } from './Export/index.js'
import { getActiveNodeArrayFromPathname } from '../modules/getActiveNodeArrayFromPathname.js'

export const store = () =>
  types
    .model({
      export: types.optional(Export, defaultExport),
      editingTaxonomies: types.optional(types.boolean, false),
      editingPCs: types.optional(types.boolean, false),
      activeNodeArray: types.optional(
        types.array(types.union(types.string, types.number)),
        [],
      ),
      sidebarWidth: types.maybeNull(types.number, null),
      docFilter: types.optional(types.union(types.string, types.number), ''),
      windowWidth: types.optional(types.number, 800),
      windowHeight: types.optional(types.number, 800),
    })
    .actions((self) => ({
      setWindowHeight(val) {
        self.windowHeight = val
      },
      setWindowWidth(val) {
        self.windowWidth = val
      },
      setSidebarWidth(val) {
        self.sidebarWidth = val
      },
      setDocFilter(val) {
        self.docFilter = val
      },
      setEditingTaxonomies(value) {
        self.editingTaxonomies = value
      },
      setEditingPCs(value) {
        self.editingPCs = value
      },
      setActiveNodeArray(value, navigate) {
        self.activeNodeArray = value
        const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
        if (!isEqual(activeNodeArrayFromUrl, value) && navigate) {
          navigate(`/${value.join('/')}`)
          setTimeout(() => self.scrollIntoView())
        }
      },
    }))
    .views((self) => ({
      get singleColumnView() {
        return self.windowWidth <= 700
      },
    }))
