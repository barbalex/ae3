import {
  MdExpandMore as ExpandMoreIcon,
  MdMoreHoriz as MoreHorizIcon,
  MdChevronRight as ChevronRightIcon,
  //MdRefresh as LoadingIcon,
  MdHourglassEmpty as LoadingIcon,
} from 'react-icons/md'
import Icon from '@mui/material/Icon'
import { isEqual } from 'es-toolkit'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { useSetAtom, useAtomValue } from 'jotai'

import { isUrlInActiveNodePath } from '../../../modules/isUrlInActiveNodePath.js'
import {
  treeContextMenuAtom,
  nextMenuOpenId,
  holdToDisplayMs,
} from '../contextmenu/treeContextMenuAtom.js'
import { activeNodeArrayAtom } from '../../../store/index.ts'

import styles from './index.module.css'

export const Row = ({ data }) => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const navigate = useNavigate()
  const openTreeContextMenu = useSetAtom(treeContextMenuAtom)

  const nodeIsInActiveNodePath = isUrlInActiveNodePath(
    data.url,
    activeNodeArray,
  )
  // build symbols
  let useSymbolIcon = true
  let useSymbolSpan = false
  let useLoadingSpan = false
  let symbol
  if (data.childrenCount && nodeIsInActiveNodePath) {
    symbol = 'ExpandMore'
  } else if (data.childrenCount) {
    symbol = 'ChevronRight'
  } else if (data.label === 'lade Daten') {
    symbol = 'MoreHoriz'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  if (data.label === '...') {
    useSymbolSpan = false
    useSymbolIcon = false
    useLoadingSpan = true
  }
  const { url } = data
  const level = url?.length ?? 0

  const onClickNode = async () => {
    // or if node is already active
    if (!isEqual(url, activeNodeArray)) {
      navigate(`/${url.join('/')}`)
    }
  }

  const onClickExpandMore = (event) => {
    // clicking the open symbol always closes the node
    // and activates it's parent
    // stop the row's onClick from navigating back into the node
    event.stopPropagation()
    const newUrl = url.toSpliced(-1)
    navigate(`/${newUrl.join('/')}`)
  }

  // holding the left mouse button (or touch) opens the menu, as before
  const holdToDisplayTimer = useRef(null)
  const holdToDisplayStart = useRef(null)
  const clearHoldToDisplay = () => {
    if (holdToDisplayTimer.current) {
      clearTimeout(holdToDisplayTimer.current)
      holdToDisplayTimer.current = null
    }
    holdToDisplayStart.current = null
  }
  const onPointerDownNode = (e) => {
    if (e.button !== 0) return
    const start = { x: e.clientX, y: e.clientY }
    holdToDisplayStart.current = start
    holdToDisplayTimer.current = setTimeout(() => {
      openTreeContextMenu({
        id: nextMenuOpenId(),
        node: data,
        x: start.x,
        y: start.y,
      })
    }, holdToDisplayMs)
  }
  const onPointerMoveNode = (e) => {
    const start = holdToDisplayStart.current
    // moving away means dragging or scrolling, not holding still
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 9) {
      clearHoldToDisplay()
    }
  }
  // open the context menu; suppress the browser menu like the former
  // trigger did, also when no menu exists for this menuType
  const onContextMenuNode = (e) => {
    e.preventDefault()
    // keep the menu's own contextmenu listener from closing the new menu
    e.stopPropagation()
    clearHoldToDisplay()
    openTreeContextMenu({
      id: nextMenuOpenId(),
      node: data,
      x: e.clientX,
      y: e.clientY,
    })
  }

  //console.log('Row, data:', data)

  return (
    <div
      className={styles.node}
      data-id={data.id}
      data-url={data.url}
      onClick={onClickNode}
      // need this id to scroll elements into view
      id={data.id}
      onContextMenu={onContextMenuNode}
      onPointerDown={onPointerDownNode}
      onPointerMove={onPointerMoveNode}
      onPointerUp={clearHoldToDisplay}
      onPointerCancel={clearHoldToDisplay}
      onPointerLeave={clearHoldToDisplay}
      style={{
        gridTemplateColumns: `${level * 23 - 23}px 23px 1fr`,
        color: nodeIsInActiveNodePath ? 'var(--ae-brand-accent)' : 'inherit',
      }}
    >
      <div className={styles.spacer} />
      <div className={styles.toggle}>
        {useSymbolIcon && (
          <Icon
            id="symbol"
            className={`material-icons ${styles.symbolIcon}`}
            style={{
              fontSize: nodeIsInActiveNodePath ? 26 : 23,
              fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit',
              color: nodeIsInActiveNodePath ? 'var(--ae-brand-accent)' : 'inherit',
            }}
          >
            {symbol === 'Loading' && <LoadingIcon />}
            {symbol === 'ExpandMore' && (
              <ExpandMoreIcon onClick={onClickExpandMore} />
            )}
            {symbol === 'ChevronRight' && <ChevronRightIcon />}
            {symbol === 'MoreHoriz' && <MoreHorizIcon />}
          </Icon>
        )}
        {useSymbolSpan && (
          <span
            className={styles.symbolSpan}
            style={{ fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit' }}
          >
            {'-'}
          </span>
        )}
        {useLoadingSpan && (
          <span
            className={styles.symbolSpan}
            style={{ fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit' }}
          >
            {' '}
          </span>
        )}
      </div>
      <div className={styles.content}>
        <span
          className={styles.textSpan}
          style={{ fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit' }}
        >
          {data.label ?? data.id}
        </span>
        {data.info !== undefined && (
          <span className={styles.infoSpan}>{`(${data.info})`}</span>
        )}
      </div>
    </div>
  )
}
