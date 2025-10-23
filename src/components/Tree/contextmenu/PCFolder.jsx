import {
  ContextMenu,
  MenuItem,
  connectMenu,
} from '../../../modules/react-contextmenu/index.js'

const dataInsert = {
  action: 'insert',
  table: 'pc',
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
        erstelle neue Eigenschaften-Sammlung
      </MenuItem>
    </ContextMenu>
  )
}

export const CmPCFolder = connectMenu('CmPCFolder')(DynamicMenu)
