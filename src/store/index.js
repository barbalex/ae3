import { types } from 'mobx-state-tree'

import Export, { defaultValue as defaultExport } from './Export/index.js'

export const store = () =>
  types
    .model({
      export: types.optional(Export, defaultExport),
    })

