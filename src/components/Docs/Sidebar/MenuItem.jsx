import React, { useCallback, useContext } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router'
import styled from '@emotion/styled'

import storeContext from '../../../storeContext.js'

const ListItem = styled(ListItemButton)`
  ${(props) => props.ischild1 === 'true' && 'padding-left: 35px !important;'}
`

const MenuItem = ({ node }) => {
  const { sidebarWidth, setSidebarWidth } = useContext(storeContext)

  const location = useLocation()
  const navigate = useNavigate()

  const { slug, title } = node
  const activeUrl = `/Dokumentation/${slug}`
  const active =
    activeUrl === location.pathname || `${activeUrl}/` === location.pathname

  const onClickMenuItem = useCallback(() => {
    navigate(`${activeUrl}/`)
    sidebarWidth && setSidebarWidth(null)
  }, [activeUrl, navigate, setSidebarWidth, sidebarWidth])

  return (
    <>
      <ListItem onClick={onClickMenuItem} selected={active} divider>
        <ListItemText onClick={onClickMenuItem}>
          {title ?? '(Titel fehlt)'}
        </ListItemText>
      </ListItem>
    </>
  )
}

export default MenuItem
