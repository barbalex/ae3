import React from 'react'

import {
  ContextMenu,
  MenuItem,
  connectMenu,
} from '../../../modules/react-contextmenu/index.js'

const dataInsert = {
  action: 'insert',
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
        erstelle neue Taxonomie
      </MenuItem>
    </ContextMenu>
  )
}

const ConnectedMenu = connectMenu('CmType')(DynamicMenu)

export default ConnectedMenu
