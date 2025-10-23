import {
  ContextMenu,
  MenuItem,
  connectMenu,
} from '../../../modules/react-contextmenu/index.js'

const dataInsert = {
  action: 'insert',
  table: 'object',
}
const dataDelete = {
  action: 'delete',
  table: 'taxonomy',
}

const DynamicMenu = ({ id, trigger }) => {
  const handleItemClick = trigger ? trigger.onItemClick : null
  const nodeLabel = trigger ? trigger.nodeLabel : ''

  return (
    <ContextMenu
      id={id}
      collect={(props) => props}
    >
      <div className="react-contextmenu-title">{nodeLabel}</div>
      <MenuItem
        onClick={handleItemClick}
        data={dataInsert}
      >
        erstelle neues Objekt (eine Ebene tiefer)
      </MenuItem>
      <MenuItem
        onClick={handleItemClick}
        data={dataDelete}
      >
        lösche
      </MenuItem>
    </ContextMenu>
  )
}

export const CmTaxonomy = connectMenu('CmTaxonomy')(DynamicMenu)
