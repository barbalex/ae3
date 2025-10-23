import {
  ContextMenu,
  MenuItem,
  connectMenu,
} from '../../../modules/react-contextmenu/index.js'

const dataDelete = {
  action: 'delete',
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
        data={dataDelete}
      >
        lösche
      </MenuItem>
    </ContextMenu>
  )
}

export const CmPC = connectMenu('CmPC')(DynamicMenu)
