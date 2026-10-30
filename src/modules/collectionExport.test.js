import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiFetch } from './api.js'
import {
  collectionSortDirection,
  collectionOrder,
  fetchCollectionPages,
} from './collectionExport.js'

vi.mock('./api.js', () => ({ apiFetch: vi.fn() }))

describe('collectionOrder', () => {
  it('orders standard fields, custom properties, and stable ties', () => {
    expect(
      collectionOrder(
        'Objekt Name',
        'desc',
        { 'Objekt Name': 'objectByObjectId(name)' },
      ),
    ).toBe('objectByObjectId(name).desc,id.asc')
    expect(collectionOrder('Wert', 'asc', {})).toBe(
      'properties->Wert.asc,id.asc',
    )
  })

  it('reverses boolean property ordering for the Ja/Nein display values', () => {
    expect(
      collectionSortDirection('Wert', 'asc', ['Wert'], [
        { properties: { Wert: false } },
      ]),
    ).toBe('desc')
    expect(
      collectionSortDirection('Wert', 'desc', ['Wert'], [
        { properties: { Wert: 'text' } },
      ]),
    ).toBe('desc')
  })
})

describe('fetchCollectionPages', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches bounded pages with advancing offsets and stops at the count', async () => {
    apiFetch
      .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
      .mockResolvedValueOnce([{ id: 3 }])

    const pages = []
    for await (const page of fetchCollectionPages('/object?select=id', {
      pageSize: 2,
      totalCount: 3,
    })) {
      pages.push(page)
    }

    expect(pages).toEqual([[{ id: 1 }, { id: 2 }], [{ id: 3 }]])
    expect(apiFetch.mock.calls.map(([path]) => path)).toEqual([
      '/object?select=id&limit=2&offset=0',
      '/object?select=id&limit=2&offset=2',
    ])
  })

  it('stops when the API returns an empty page', async () => {
    apiFetch.mockResolvedValueOnce([])

    const pages = []
    for await (const page of fetchCollectionPages('/object?select=id', {
      pageSize: 2,
    })) {
      pages.push(page)
    }

    expect(pages).toEqual([])
    expect(apiFetch).toHaveBeenCalledTimes(1)
  })
})