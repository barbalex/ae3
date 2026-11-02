import { Link } from 'react-router'
import SimpleBar from 'simplebar-react'
import { useAtomValue } from 'jotai'

import { MenuItems } from './MenuItems'
import { Filter } from './Filter'
import { constants } from '../../../modules/constants'
import { sidebarWidthAtom } from '../../../store'

import styles from './index.module.css'

type SidebarProps = {
  stacked?: boolean
}

export const Sidebar = ({ stacked }: SidebarProps) => {
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
