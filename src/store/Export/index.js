import { types } from 'mobx-state-tree'

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
