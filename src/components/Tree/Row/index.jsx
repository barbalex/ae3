import {
  MdExpandMore as ExpandMoreIcon,
  MdMoreHoriz as MoreHorizIcon,
  MdChevronRight as ChevronRightIcon,
  //MdRefresh as LoadingIcon,
  MdHourglassEmpty as LoadingIcon,
} from 'react-icons/md'
import Icon from '@mui/material/Icon'
import { isEqual } from 'es-toolkit'
import { useNavigate } from 'react-router'
import { useSetAtom, useAtomValue } from 'jotai'

import { ContextMenuTrigger } from '../../../modules/react-contextmenu/index.js'
import { isUrlInActiveNodePath } from '../../../modules/isUrlInActiveNodePath.js'
import { onClickContextMenu } from './onClickContextMenu.js'
import {
  scrollIntoViewAtom,
  loginUsernameAtom,
  activeNodeArrayAtom,
} from '../../../store/index.ts'

import styles from './index.module.css'

function collect(props) {
  return props
}

export const Row = ({ data }) => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)
  const loginUsername = useAtomValue(loginUsernameAtom)
  const navigate = useNavigate()

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
    if (isEqual(url, activeNodeArray)) {
      // close node if its expand more symbol was clicked
      const newUrl = url.toSpliced(-1)
      navigate(`/${newUrl.join('/')}`)
      // prevent onClick on node
      event.preventDefault()
    }
  }

  const onClickContextCallback = (e, data, target) =>
    onClickContextMenu({
      e,
      data,
      target,
      scrollIntoView,
      loginUsername,
      navigate,
    })

  //console.log('Row, data:', data)

  return (
    <ContextMenuTrigger
      id={data.menuType}
      collect={collect}
      nodeId={data.id}
      nodeLabel={data.label}
      key={data.id}
      onItemClick={onClickContextCallback}
    >
      <div
        className={styles.node}
        data-id={data.id}
        data-url={data.url}
        onClick={onClickNode}
        // need this id to scroll elements into view
        id={data.id}
        style={{
          gridTemplateColumns: `${level * 23 - 23}px 23px 1fr`,
          color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
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
                color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
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
    </ContextMenuTrigger>
  )
}
