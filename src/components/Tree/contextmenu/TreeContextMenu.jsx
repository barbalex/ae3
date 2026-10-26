import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { useNavigate } from 'react-router'

import { treeContextMenuAtom } from './treeContextMenuAtom.js'
import { treeMenuConfigs } from './menuConfig.js'
import { onClickContextMenu } from '../Row/onClickContextMenu.js'
import {
  scrollIntoViewAtom,
  loginUsernameAtom,
} from '../../../store/index.ts'

import styles from './TreeContextMenu.module.css'

// mounted fresh for every menu opened (key={menuState}), so selection
// state resets automatically
const OpenContextMenu = ({ menuState, node, config, runItem, closeMenu }) => {
  const menuRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // place the menu at the pointer before paint, flipping at the
  // viewport edges; hidden until placed to avoid flicker
  useLayoutEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const { x, y } = menuState
    const { innerWidth, innerHeight } = window
    const rect = menu.getBoundingClientRect()
    let top = y
    let left = x
    if (y + rect.height > innerHeight) {
      top -= rect.height
    }
    if (x + rect.width > innerWidth) {
      left -= rect.width
    }
    if (top < 0) {
      top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0
    }
    if (left < 0) {
      left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0
    }
    menu.style.top = `${top}px`
    menu.style.left = `${left}px`
    menu.style.visibility = 'visible'
  }, [menuState])

  const activateItem = (index) => {
    const item = config.items[index]
    closeMenu()
    if (item) {
      runItem(item)
    }
  }

  // hide on outside pointer down, any scroll, resize, context menu
  // elsewhere; keyboard navigation
  useEffect(() => {
    const menu = menuRef.current
    const onPointerDown = (e) => {
      if (!menu?.contains(e.target)) closeMenu()
    }
    // rows stopPropagation on their contextmenu events, so this only
    // fires for context menus opened elsewhere on the page
    const onContextMenu = (e) => {
      if (!menu?.contains(e.target)) closeMenu()
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) =>
          config.items.length === 0 ? -1 : (i + 1) % config.items.length,
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) =>
          config.items.length === 0 ?
            -1
          : (i <= 0 ? config.items.length : i) - 1,
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        // like the former implementation: Enter without selection closes
        if (selectedIndex === -1) {
          closeMenu()
        } else {
          activateItem(selectedIndex)
        }
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    // capture: also catch scrolls of elements like the tree container
    document.addEventListener('scroll', closeMenu, { capture: true })
    window.addEventListener('resize', closeMenu)
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('scroll', closeMenu, { capture: true })
      window.removeEventListener('resize', closeMenu)
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.items, selectedIndex, closeMenu, runItem, node])

  return createPortal(
    <nav
      role="menu"
      tabIndex={-1}
      ref={menuRef}
      className={styles.menu}
      style={{ position: 'fixed', visibility: 'hidden' }}
      onContextMenu={(e) => {
        e.preventDefault()
        closeMenu()
      }}
      onMouseLeave={() => closeMenu()}
    >
      <div className={styles.title}>{config.title ?? node.label}</div>
      {config.items.map((item, index) => (
        <div
          key={index}
          role="menuitem"
          tabIndex={-1}
          className={
            index === selectedIndex ?
              `${styles.item} ${styles.itemSelected}`
            : styles.item
          }
          onClick={() => activateItem(index)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          {item.label}
        </div>
      ))}
    </nav>,
    document.body,
  )
}

/**
 * single context menu for the nav tree, replacing the vendored
 * react-contextmenu library. Opened via treeContextMenuAtom.
 * Renders the menu for the node's menuType from treeMenuConfigs.
 */
export const TreeContextMenu = ({ userIsTaxWriter }) => {
  const menuState = useAtomValue(treeContextMenuAtom)
  const closeMenu = useSetAtom(treeContextMenuAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)
  const loginUsername = useAtomValue(loginUsernameAtom)
  const navigate = useNavigate()

  const node = menuState?.node
  const config = node ? treeMenuConfigs[node.menuType] : undefined

  if (!menuState || !node || !config) return null
  // menus of taxonomy writers are not available for other users, as before
  if (config.taxWriterOnly && !userIsTaxWriter) return null

  const runItem = (item) =>
    onClickContextMenu({
      data: { action: item.action, table: item.table },
      id: node.id,
      url: node.url,
      scrollIntoView,
      loginUsername,
      navigate,
    })

  return (
    <OpenContextMenu
      key={menuState.id}
      menuState={menuState}
      node={node}
      config={config}
      runItem={runItem}
      closeMenu={() => closeMenu(null)}
    />
  )
}
