import { Link } from 'react-router'
import SimpleBar from 'simplebar-react'
import { useAtomValue } from 'jotai'

import { MenuItems } from './MenuItems.jsx'
import { Filter } from './Filter.jsx'
import { constants } from '../../../modules/constants.js'
import { sidebarWidthAtom } from '../../../store/index.ts'

import styles from './index.module.css'

export const Sidebar = ({ stacked }) => {
  const sidebarWidth = useAtomValue(sidebarWidthAtom)

  if (sidebarWidth === 0) return null

  return (
    <div
      className={styles.menu}
      data-stacked={stacked}
      style={{
        width: stacked ? '100%' : constants.sidebar.width,
        minWidth: constants.sidebar.width,
      }}
    >
      <SimpleBar className={styles.simpleBar}>
        <div className={styles.menuTitle}>
          <Link
            to={`/Dokumentation/`}
            className={styles.menuTitleLink}
          >
            Dokumentation
          </Link>
          <Filter />
        </div>
        <MenuItems />
      </SimpleBar>
    </div>
  )
}
