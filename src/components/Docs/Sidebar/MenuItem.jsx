import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router'
import { useAtom } from 'jotai'

import { sidebarWidthAtom } from '../../../jotaiStore/index.ts'

export const MenuItem = ({ node }) => {
  const [sidebarWidth, setSidebarWidth] = useAtom(sidebarWidthAtom)

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
}
