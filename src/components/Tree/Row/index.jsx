import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import {
  MdExpandMore as ExpandMoreIcon,
  MdMoreHoriz as MoreHorizIcon,
  MdChevronRight as ChevronRightIcon,
  //MdRefresh as LoadingIcon,
  MdHourglassEmpty as LoadingIcon,
} from 'react-icons/md'
import Icon from '@mui/material/Icon'
import isEqual from 'lodash/isEqual'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { getSnapshot } from 'mobx-state-tree'
import { useQueryClient } from '@tanstack/react-query'

import { ContextMenuTrigger } from 'react-contextmenu'
import isUrlInActiveNodePath from '../../../modules/isUrlInActiveNodePath.js'
import onClickContextMenuDo from './onClickContextMenu.js'
import storeContext from '../../../storeContext.js'

const rowHeight = 23
const StyledNode = styled.div`
  display: grid;
  grid-template-areas: 'spacer toggle content';
  grid-template-columns: ${(props) =>
    `${Number(props['data-level']) * rowHeight - rowHeight}px ${rowHeight}px 1fr`};
  grid-template-rows: ${rowHeight}px;
  align-items: center;
  box-sizing: border-box;
  margin: 0;
  white-space: nowrap;
  // ellipsis for overflow
  // TODO: not working
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;
  // do not layout offscreen content while allowing search
  // https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
  // UUPS: this prevents horizontal scrolling!
  // see: https://stackoverflow.com/a/76597041/712005
  // using contain on parent also
  content-visibility: auto;
  contain-intrinsic-size: auto ${rowHeight}px;
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315' : 'inherit'};
  &:hover {
    color: #f57c00 !important;
  }
`
const Spacer = styled.div`
  grid-area: spacer;
`
const Toggle = styled.div`
  grid-area: toggle;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: ${rowHeight}px;
`
const SymbolIcon = styled(Icon)`
  font-size: ${(props) =>
    props['data-nodeisinactivenodepath']
      ? '26px !important'
      : '23px !important'};
  font-weight: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '700 !important' : 'inherit'};
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  &:hover {
    color: #f57c00 !important;
  }
`
const SymbolSpan = styled.span`
  font-weight: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '700 !important' : 'inherit'};
  font-size: 28px !important;
  // somehow this is needed to align vertically
  margin-top: -3px;
`
const Content = styled.div`
  grid-area: content;
  line-height: ${rowHeight}px;
  display: flex;
  column-gap: 5px;
`
const TextSpan = styled.span`
  font-size: 16px !important;
  font-weight: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '700 !important' : 'inherit'};
`
const InfoSpan = styled.span`
  font-size: 12px !important;
`

function collect(props) {
  return props
}

const Row = ({ data }) => {
  const queryClient = useQueryClient()
  const client = useApolloClient()

  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
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

  const onClickNode = useCallback(async () => {
    // or if node is already active
    if (!isEqual(url, activeNodeArray)) {
      navigate(`/${url.join('/')}`)
    }
  }, [activeNodeArray, navigate, url])
  const onClickExpandMore = useCallback(
    (event) => {
      if (isEqual(url, activeNodeArray)) {
        // close node if its expand more symbol was clicked
        const newUrl = [...url]
        newUrl.pop()
        navigate(`/${newUrl.join('/')}`)
        // prevent onClick on node
        event.preventDefault()
      }
    },
    [url, activeNodeArray, navigate],
  )
  const onClickContextMenu = useCallback(
    (e, data, target) => {
      onClickContextMenuDo({
        e,
        data,
        target,
        client,
        // TODO: check this behavior
        treeRefetch: () => {},
        store,
        navigate,
        queryClient,
      })
    },
    [client, store, navigate, queryClient],
  )

  //console.log('Row, data:', data)

  return (
    <ContextMenuTrigger
      id={data.menuType}
      collect={collect}
      nodeId={data.id}
      nodeLabel={data.label}
      key={data.id}
      onItemClick={onClickContextMenu}
    >
      <StyledNode
        data-level={level}
        data-nodeisinactivenodepath={nodeIsInActiveNodePath}
        data-id={data.id}
        data-url={data.url}
        onClick={onClickNode}
        // need this id to scroll elements into view
        id={data.id}
      >
        <Spacer />
        <Toggle>
          {useSymbolIcon && (
            <SymbolIcon
              id="symbol"
              data-nodeisinactivenodepath={nodeIsInActiveNodePath}
              className="material-icons"
            >
              {symbol === 'Loading' && <LoadingIcon />}
              {symbol === 'ExpandMore' && (
                <ExpandMoreIcon onClick={onClickExpandMore} />
              )}
              {symbol === 'ChevronRight' && <ChevronRightIcon />}
              {symbol === 'MoreHoriz' && <MoreHorizIcon />}
            </SymbolIcon>
          )}
          {useSymbolSpan && (
            <SymbolSpan data-nodeisinactivenodepath={nodeIsInActiveNodePath}>
              {'-'}
            </SymbolSpan>
          )}
          {useLoadingSpan && (
            <SymbolSpan data-nodeisinactivenodepath={nodeIsInActiveNodePath}>
              {' '}
            </SymbolSpan>
          )}
        </Toggle>
        <Content>
          <TextSpan data-nodeisinactivenodepath={nodeIsInActiveNodePath}>
            {data.label}
          </TextSpan>
          {data.info !== undefined && <InfoSpan>{`(${data.info})`}</InfoSpan>}
        </Content>
      </StyledNode>
    </ContextMenuTrigger>
  )
}

export default observer(Row)
