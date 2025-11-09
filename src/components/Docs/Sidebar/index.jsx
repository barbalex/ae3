import { useContext } from 'react'
import { Link } from 'react-router'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import { storeContext } from '../../../storeContext.js'
import { MenuItems } from './MenuItems.jsx'
import { Filter } from './Filter.jsx'
import { constants } from '../../../modules/constants.js'

import { menu, menuTitle, menuTitleLink, simpleBar } from './index.module.css'

export const Sidebar = observer(({ stacked }) => {
  const store = useContext(storeContext)
  const { sidebarWidth } = store

  if (sidebarWidth === 0) return null

  return (
    <div
      className={menu}
      data-stacked={stacked}
      style={{
        width: stacked ? '100%' : constants.sidebar.width,
        minWidth: constants.sidebar.width,
      }}
    >
      <SimpleBar className={simpleBar}>
        <div className={menuTitle}>
          <Link
            to={`/Dokumentation/`}
            className={menuTitleLink}
          >
            Dokumentation
          </Link>
          <Filter />
        </div>
        <MenuItems />
      </SimpleBar>
    </div>
  )
})
