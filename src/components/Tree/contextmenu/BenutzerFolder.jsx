import {
  ContextMenu,
  MenuItem,
  connectMenu,
} from '../../../modules/react-contextmenu/index.js'

const data = {
  action: 'insert',
  table: 'user',
}

const DynamicMenu = ({ id, trigger }) => {
  const handleItemClick = trigger ? trigger.onItemClick : null

  return (
    <ContextMenu
      id={id}
      collect={(props) => props}
    >
      <div className="react-contextmenu-title">Benutzer</div>
      <MenuItem
        onClick={handleItemClick}
        data={data}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  )
}

export const CmBenutzerFolder = connectMenu('CmBenutzerFolder')(DynamicMenu)
