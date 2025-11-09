import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router'

import { storeContext } from '../../../storeContext.js'

export const MenuItem = observer(({ node }) => {
  const { sidebarWidth, setSidebarWidth } = useContext(storeContext)

  const location = useLocation()
  const navigate = useNavigate()

  const { slug, title } = node
  const activeUrl = `/Dokumentation/${slug}`
  const active =
    activeUrl === location.pathname || `${activeUrl}/` === location.pathname

  const onClickMenuItem = () => {
    navigate(`${activeUrl}/`)
    sidebarWidth && setSidebarWidth(null)
  }

  return (
    <ListItemButton
      onClick={onClickMenuItem}
      selected={active}
      divider
    >
      <ListItemText onClick={onClickMenuItem}>
        {title ?? '(Titel fehlt)'}
      </ListItemText>
    </ListItemButton>
  )
})
