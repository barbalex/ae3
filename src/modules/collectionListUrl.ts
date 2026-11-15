// search-param codec for the PCO/RCO collection list views (sort column,
// direction, row count) so a configured list view is a shareable link.
// Values equal to the defaults are omitted to keep casual URLs clean.

export type CollectionListState = {
  count: number
  orderBy: string
  sortDirection: 'asc' | 'desc'
}

export const defaultCollectionListState: CollectionListState = {
  count: 15,
  orderBy: 'Objekt Name',
  sortDirection: 'asc',
}

// orderBy length guard: the value ends up in the PostgREST order= parameter,
// so absurdly long values from hand-edited links are dropped, not passed on
const maxOrderByLength = 200

export const collectionListStateFromParams = (
  params: URLSearchParams,
): CollectionListState => {
  const countParam = params.get('count')
  const count =
    countParam === null ? defaultCollectionListState.count : Number(countParam)
  const orderByParam = params.get('orderBy')
  return {
    count:
      Number.isInteger(count) && count > 0
        ? count
        : defaultCollectionListState.count,
    orderBy:
      orderByParam && orderByParam.length <= maxOrderByLength
        ? orderByParam
        : defaultCollectionListState.orderBy,
    sortDirection: params.get('dir') === 'desc' ? 'desc' : 'asc',
  }
}

// returns a copy of current with the list params set — or removed when the
// state matches the defaults; unrelated params are preserved
export const collectionListSearchParams = (
  state: CollectionListState,
  current: URLSearchParams,
): URLSearchParams => {
  const next = new URLSearchParams(current)
  if (state.count === defaultCollectionListState.count) {
    next.delete('count')
  } else {
    next.set('count', String(state.count))
  }
  if (state.orderBy === defaultCollectionListState.orderBy) {
    next.delete('orderBy')
  } else {
    next.set('orderBy', state.orderBy)
  }
  if (state.sortDirection === defaultCollectionListState.sortDirection) {
    next.delete('dir')
  } else {
    next.set('dir', state.sortDirection)
  }
  return next
}
