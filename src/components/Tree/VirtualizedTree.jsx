import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { VList } from 'virtua'

import { Row } from './Row/index.jsx'
import { LoadingRow } from './LoadingRow.jsx'
import { LoadMoreRow } from './LoadMoreRow.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'
import { TreeScrollProvider } from './treeScrollContext.js'
import { buildTreeRows, fetchMoreTreeRows } from './treeModel.js'
import { constants } from '../../modules/constants.js'
import { activeNodeArrayAtom, loginTokenAtom } from '../../store/index.ts'

const keyId = (queryKey) => queryKey.join('/')

// renders the flat tree model inside a virtualized list: only rows
// near the viewport are mounted, so deeply expanded trees stay fast.
// The flat model derives from the walk in treeModel.js over the data
// of every subscribed list query (see below)
export const VirtualizedTree = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
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
  const dataRef = useRef(new Map())
  const buildArgs = {
    activeNodeArray,
    hasToken,
    getQueryData: (key) => dataRef.current.get(keyId(key)),
  }
  const walkForEntries = buildTreeRows(buildArgs)

  // the walk recreates its query defs (and their key arrays) on every
  // render. Feeding those identities to useQueries re-diffs the
  // observers each render; reuse the previous entry object for a key
  // that was already subscribed
  const entriesRef = useRef(new Map())
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
  // subscribed yet, re-render so useQueries picks them up
  const [, setTick] = useState(0)
  useEffect(() => {
    const subscribed = new Set(entries.map((entry) => keyId(entry.queryKey)))
    if (neededQueries.some((def) => !subscribed.has(keyId(def.queryKey)))) {
      setTick((tick) => tick + 1)
    }
  })

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
  const listRef = useRef(null)

  const scrollToId = useCallback((id) => {
    const index = rowsRef.current.findIndex(
      (row) => row.type === 'row' && row.data.id === id,
    )
    if (index === -1) return false
    listRef.current?.scrollToIndex(index, { align: 'center' })
    return true
  }, [])

  // stable callback for the load-more rows; key parts contain no '/'
  const onMore = useCallback(
    (id) => fetchMoreTreeRows(queryClient, id.split('/')),
    [queryClient],
  )

  return (
    <TreeScrollProvider value={scrollToId}>
      <VList
        ref={listRef}
        // rows are 23px high (see Row/index.module.css); the hint
        // avoids scroll jumps while virtua measures
        itemSize={23}
        style={{
          height: `calc(100vh - ${constants.appBarHeight}px - 39px)`,
          flex: '1 1 auto',
          overflowY: 'auto',
        }}
      >
        {rows.map((row, index) => {
          if (row.type === 'row') {
            return <Row key={row.data.id} data={row.data} />
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
