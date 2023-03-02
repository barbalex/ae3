import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import storeContext from '../../../storeContext'
import MenuItems from './MenuItems'
import Filter from './Filter'
import getConstants from '../../../modules/constants'

const constants = getConstants()

const Menu = styled.div`
  width: ${(props) =>
    props['data-stacked'] ? '100%' : `${constants.sidebar.width}px`};
  min-width: ${constants.sidebar.width}px;
  height: calc(100vh - 64px);
  padding: 25px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  container-type: size;
`
const MenuTitle = styled.div`
  padding: 0 16px;
`
const MenuTitleLink = styled(Link)`
  font-size: 21px;
  font-weight: 700;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  &:hover {
    text-decoration: underline;
  }
`
const StyledSimpleBar = styled(SimpleBar)`
  height: calc(100cqh - 25px);
`

const Sidebar = ({ stacked }) => {
  const store = useContext(storeContext)
  const { sidebarWidth } = store

  if (sidebarWidth === 0) return null

  return (
    <Menu data-stacked={stacked}>
      <StyledSimpleBar>
        <MenuTitle>
          <MenuTitleLink to={`/Dokumentation/`}>Dokumentation</MenuTitleLink>
          <Filter />
        </MenuTitle>
        <MenuItems />
      </StyledSimpleBar>
    </Menu>
  )
}

export default observer(Sidebar)
