// menu configs per tree node menuType, replacing the former
// react-contextmenu menu components.
// title falls back to the node's label when not set.

const insert = (table, label) => ({ label, action: 'insert', table })
const remove = (table) => ({ label: 'lösche', action: 'delete', table })

export const treeMenuConfigs = {
  CmBenutzerFolder: {
    title: 'Benutzer',
    items: [insert('user', 'erstelle neuen')],
  },
  CmBenutzer: {
    title: 'Benutzer',
    items: [insert('user', 'erstelle neuen'), remove('user')],
  },
  CmType: {
    taxWriterOnly: true,
    items: [insert('taxonomy', 'erstelle neue Taxonomie')],
  },
  CmTaxonomy: {
    taxWriterOnly: true,
    items: [
      insert('object', 'erstelle neues Objekt (eine Ebene tiefer)'),
      remove('taxonomy'),
    ],
  },
  CmObject: {
    taxWriterOnly: true,
    items: [
      insert('object', 'erstelle neues Objekt (eine Ebene tiefer)'),
      remove('object'),
    ],
  },
  CmPCFolder: {
    taxWriterOnly: true,
    items: [insert('pc', 'erstelle neue Eigenschaften-Sammlung')],
  },
  CmPC: {
    taxWriterOnly: true,
    items: [remove('pc')],
  },
}
