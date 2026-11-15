import { describe, it, expect } from 'vitest'

import {
  collectionListSearchParams,
  collectionListStateFromParams,
  defaultCollectionListState,
} from './collectionListUrl'

describe('collectionListUrl', () => {
  it('returns the defaults for empty params', () => {
    expect(collectionListStateFromParams(new URLSearchParams())).toEqual(
      defaultCollectionListState,
    )
  })

  it('reads count, orderBy and descending direction from params', () => {
    expect(
      collectionListStateFromParams(
        new URLSearchParams('count=100&orderBy=Artwert&dir=desc'),
      ),
    ).toEqual({ count: 100, orderBy: 'Artwert', sortDirection: 'desc' })
  })

  it('falls back to the default count for invalid counts', () => {
    for (const count of ['0', '-5', '2.5', 'abc', 'NaN']) {
      expect(
        collectionListStateFromParams(
          new URLSearchParams(`count=${count}`),
        ).count,
      ).toBe(defaultCollectionListState.count)
    }
  })

  it('falls back to the default orderBy for empty or oversized values', () => {
    expect(
      collectionListStateFromParams(new URLSearchParams('orderBy='))
        .orderBy,
    ).toBe(defaultCollectionListState.orderBy)
    expect(
      collectionListStateFromParams(
        new URLSearchParams(`orderBy=${'x'.repeat(201)}`),
      ).orderBy,
    ).toBe(defaultCollectionListState.orderBy)
  })

  it('treats any dir other than desc as asc', () => {
    expect(
      collectionListStateFromParams(new URLSearchParams('dir=DESC'))
        .sortDirection,
    ).toBe('asc')
    expect(
      collectionListStateFromParams(new URLSearchParams('dir=desc'))
        .sortDirection,
    ).toBe('desc')
  })

  it('writes non-default state into params and keeps unrelated ones', () => {
    const next = collectionListSearchParams(
      { count: 100, orderBy: 'Artwert', sortDirection: 'desc' },
      new URLSearchParams('foo=bar&count=15'),
    )
    expect(next.get('count')).toBe('100')
    expect(next.get('orderBy')).toBe('Artwert')
    expect(next.get('dir')).toBe('desc')
    expect(next.get('foo')).toBe('bar')
  })

  it('removes params when the state matches the defaults', () => {
    const next = collectionListSearchParams(
      defaultCollectionListState,
      new URLSearchParams('count=100&orderBy=Artwert&dir=desc&foo=bar'),
    )
    expect(next.get('count')).toBeNull()
    expect(next.get('orderBy')).toBeNull()
    expect(next.get('dir')).toBeNull()
    expect(next.get('foo')).toBe('bar')
  })
})
