/* eslint-disable react-hooks/refs -- the tree walk intentionally reads/writes refs during render; see the algorithm comment inside the component */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { isEqual } from 'es-toolkit'
import { useNavigate } from 'react-router'
import { VList, type VListHandle } from 'virtua'

import { Row } from './Row/index'
import { LoadingRow } from './LoadingRow'
import { LoadMoreRow } from './LoadMoreRow'
import { IntoViewScroller } from './IntoViewScroller'
import { TreeScrollProvider } from './treeScrollContext'
import { buildTreeRows, fetchMoreTreeRows } from './treeModel'
import { constants } from '../../modules/constants'
import { activeNodeArrayAtom, loginTokenAtom } from '../../store'

const keyId = (queryKey: readonly unknown[]) => queryKey.join('/')

// renders the flat tree model inside a virtualized list: only rows
// near the viewport are mounted, so deeply expanded trees stay fast.
// The flat model derives from the walk in treeModel.js over the data
// of every subscribed list query (see below)
export const VirtualizedTree = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const navigate = useNavigate()
  const loginToken = useAtomValue(loginTokenAtom)
  const hasToken = !!loginToken
  const queryClient = useQueryClient()

  // The walk must run before useQueries (its result defines what to
  // subscribe to) but needs the queries' data. The data of the
  // current render's subscriptions is only known after the hook, so:
  // 1. walk over the previous render's data to build the entries
  // 2. read the fresh results of those entries into dataRef
  // 3. walk again to build the rows actually rendered
  // Reading the query cache directly instead (during render) missed
  // resolutions and left levels stuck at their loading row
  const dataRef = useRef(new Map<string, any>())
  const buildArgs = {
    activeNodeArray,
    hasToken,
    getQueryData: (key: readonly unknown[]) => dataRef.current.get(keyId(key)),
  }
  const walkForEntries = buildTreeRows(buildArgs)

  // the walk recreates its query defs (and their key arrays) on every
  // render. Feeding those identities to useQueries re-diffs the
  // observers each render; reuse the previous entry object for a key
  // that was already subscribed
  const entriesRef = useRef(new Map<string, { queryKey: readonly unknown[]; queryFn: (context: any) => Promise<any> }>())
  const prevEntries = entriesRef.current
  const nextEntries = new Map()
  const entries = walkForEntries.queries.map((def) => {
    const id = keyId(def.queryKey)
    const entry =
      prevEntries.get(id) ?? { queryKey: def.queryKey, queryFn: def.queryFn }
    nextEntries.set(id, entry)
    return entry
  })
  entriesRef.current = nextEntries

  const results = useQueries({ queries: entries })
  dataRef.current = new Map(
    entries.map((entry, index) => [keyId(entry.queryKey), results[index].data]),
  )

  const { rows, queries: neededQueries, pathHoles } = buildTreeRows(buildArgs)

  // liveness: when the fresh walk needs queries that are not
  // subscribed yet, re-render so useQueries picks them up.
  // deliberate synchronous setState in an effect - it is the
  // re-render trigger itself and stops as soon as the subscriptions
  // cover the walk
  const [, setTick] = useState(0)
  useEffect(() => {
    const subscribed = new Set(entries.map((entry) => keyId(entry.queryKey)))
    if (neededQueries.some((def) => !subscribed.has(keyId(def.queryKey)))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTick((tick) => tick + 1)
    }
  }, [entries, neededQueries])

  // deep links into paginated levels: the url expects a child that
  // the loaded pages do not contain - fetch further pages until it
  // appears or the list is complete. fetchMoreTreeRows no-ops while
  // a fetch is in flight
  useEffect(() => {
    pathHoles.forEach((queryKey) => {
      // errors reset the loading flag; the more-row stays clickable
      fetchMoreTreeRows(queryClient, queryKey).catch(() => {})
    })
  })

  // former levels used suspense: errors bubbled to the ErrorBoundary
  // around the tree. Rethrow the first query error to keep that
  const error = results.find((r) => r.isError)?.error
  if (error) throw error

  const rowsRef = useRef(rows)
  rowsRef.current = rows
  const listRef = useRef<VListHandle>(null)

  // the react compiler skips this component (refs during render,
  // see the top of the file) — these manual hooks are the only
  // memoization here; scrollToId is the scroll-context value and
  // must keep a stable identity
  const scrollToId = useCallback((id: string) => {
    const index = rowsRef.current.findIndex(
      (row) => row.type === 'row' && row.data.id === id,
    )
    if (index === -1) return false
    listRef.current?.scrollToIndex(index, { align: 'center' })
    return true
  }, [])

  // stable callback for the load-more rows; key parts contain no '/'
  const onMore = useCallback(
    (id: string) => fetchMoreTreeRows(queryClient, id.split('/')),
    [queryClient],
  )

  // keyboard navigation with a roving tabindex over the flat row list:
  // without explicit focus the active row is the tab stop, otherwise
  // the focused row is (loading/more rows are skipped)
  const [focusIndex, setFocusIndex] = useState(-1)
  const activeIndex = rows.findIndex(
    (row) => row.type === 'row' && isEqual(row.data.url, activeNodeArray),
  )
  const tabIndexIndex = focusIndex === -1 ? activeIndex : focusIndex

  const focusRow = (index: number) => {
    if (index === tabIndexIndex) return
    setFocusIndex(index)
    listRef.current?.scrollToIndex(index, { align: 'nearest' })
    // virtua only mounts rows near the viewport; focus after it has
    // rendered the scrolled-to row
    requestAnimationFrame(() => {
      const row = rowsRef.current[index]
      if (row?.type === 'row') {
        document.getElementById(row.data.id)?.focus()
      }
    })
  }
  const nextRowIndex = (from: number, delta: number) => {
    let index = from
    do {
      index += delta
    } while (
      index >= 0 &&
      index < rows.length &&
      rows[index].type !== 'row'
    )
    return index >= 0 && index < rows.length ? index : from
  }

  const onKeyDownRow = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    const row = rows[index]
    if (row.type !== 'row') return
    const url = row.data.url ?? []
    const expanded =
      url.length <= activeNodeArray.length &&
      isEqual(activeNodeArray.slice(0, url.length), url)
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusRow(nextRowIndex(index, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        focusRow(nextRowIndex(index, -1))
        break
      case 'ArrowRight':
        event.preventDefault()
        if (!row.data.childrenCount) break
        // expansion is url state: navigating into the node expands it,
        // when already expanded move focus to the first child row
        if (!expanded) {
          navigate(`/${url.join('/')}`)
        } else {
          focusRow(nextRowIndex(index, 1))
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        // collapsing activates the parent, like the open symbol does;
        // a collapsed node moves focus to its parent row
        if (expanded && url.length > 0) {
          navigate(`/${url.toSpliced(-1).join('/')}`)
        } else {
          const parentIndex = rows.findIndex(
            (r, i) =>
              i < index && r.type === 'row' && r.data.url?.length === url.length - 1,
          )
          if (parentIndex !== -1) focusRow(parentIndex)
        }
        break
      case 'Home':
        event.preventDefault()
        focusRow(nextRowIndex(-1, 1))
        break
      case 'End':
        event.preventDefault()
        focusRow(nextRowIndex(rows.length, -1))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!isEqual(url, activeNodeArray)) navigate(`/${url.join('/')}`)
        break
    }
  }

  return (
    <TreeScrollProvider value={scrollToId}>
      <VList
        ref={listRef}
        // rows are 23px high (see Row/index.module.css); the hint
        // avoids scroll jumps while virtua measures
        itemSize={23}
        role="tree"
        aria-label="Baum"
        style={{
          height: `calc(100vh - ${constants.appBarHeight}px - 39px)`,
          flex: '1 1 auto',
          overflowY: 'auto',
        }}
      >
        {rows.map((row, index) => {
          if (row.type === 'row') {
            return (
              <Row
                key={row.data.id}
                data={row.data}
                tabIndex={index === tabIndexIndex ? 0 : -1}
                onKeydown={(event) => onKeyDownRow(event, index)}
              />
            )
          }
          if (row.type === 'loading') {
            return <LoadingRow key={`loading-${index}`} level={row.level} />
          }
          return (
            <LoadMoreRow
              key={`more-${row.queryKey.join('/')}`}
              level={row.level}
              loading={row.loading}
              queryKey={row.queryKey}
              onMore={onMore}
            />
          )
        })}
      </VList>
      {/* inside the provider: consumes the scroll context */}
      <IntoViewScroller />
    </TreeScrollProvider>
  )
}
