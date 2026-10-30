import { describe, it, expect, vi } from 'vitest'

import {
  buildTreeRows,
  fetchMoreTreeRows,
  rootCountsQuery,
  treePageSize,
} from './treeModel.js'
import { apiFetch } from '../../modules/api.js'

vi.mock('../../modules/api.js', () => ({
  apiFetch: vi.fn(),
  apiCount: vi.fn(),
}))

const counts = { arten: 2, lebensraeume: 1, pcs: 1, users: 1, organizations: 1 }

const makeCache = (entries = {}) => ({
  get: (key) => entries[key.join('/')],
})

const list = (rows, { complete = true, loading = false } = {}) => ({
  rows,
  complete,
  loading,
})

describe('buildTreeRows', () => {
  it('renders a single loading row and requests only the root counts while they load', () => {
    const { rows, queries } = buildTreeRows({
      activeNodeArray: [],
      hasToken: false,
      getQueryData: makeCache().get,
    })

    expect(rows).toEqual([{ type: 'loading', level: 1 }])
    expect(queries.map((q) => q.queryKey)).toEqual([['tree', 'root', false]])
  })

  it('renders the root rows, Benutzer/Organisationen only with a token', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: [],
      hasToken: false,
      getQueryData: makeCache({ 'tree/root/false': counts }).get,
    })

    expect(rows.map((r) => r.data.label)).toEqual([
      'Arten',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
    ])

    const withToken = buildTreeRows({
      activeNodeArray: [],
      hasToken: true,
      getQueryData: makeCache({ 'tree/root/true': counts }).get,
    })
    expect(withToken.rows.map((r) => r.data.label)).toEqual([
      'Arten',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
      'Benutzer',
      'Organisationen',
    ])
  })

  it('renders taxonomies of an open root with urls built from the type', () => {
    const { rows, queries } = buildTreeRows({
      activeNodeArray: ['Arten'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([
          { id: 'tax1', name: 'CSCF', objectCount: [{ count: 3 }] },
          { id: 'tax2', name: null, objectCount: [] },
        ]),
      }).get,
    })

    expect(rows.map((r) => r.data?.label)).toEqual([
      'Arten',
      'CSCF',
      'tax2',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
    ])
    expect(rows[1].data.url).toEqual(['Arten', 'tax1'])
    expect(rows[1].data.childrenCount).toBe(3)
    expect(rows[2].data.childrenCount).toBe(0)
    expect(queries.map((q) => q.queryKey)).toEqual([
      ['tree', 'root', false],
      ['tree', 'lrTax', 'Arten'],
    ])
  })

  it('expands the active taxonomy and nests its objects directly below it', () => {
    const { rows, queries } = buildTreeRows({
      activeNodeArray: ['Arten', 'tax1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF', objectCount: [{ count: 2 }] }]),
        'tree/lr/tax1': list([
          { id: 'obj1', name: 'Objekt 1', objectCount: [{ count: 0 }] },
          { id: 'obj2', name: 'Objekt 2', objectCount: [{ count: 0 }] },
        ]),
      }).get,
    })

    expect(rows.map((r) => r.data?.label)).toEqual([
      'Arten',
      'CSCF',
      'Objekt 1',
      'Objekt 2',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
    ])
    expect(rows[2].data.url).toEqual(['Arten', 'tax1', 'obj1'])
    expect(queries.map((q) => q.queryKey)).toEqual([
      ['tree', 'root', false],
      ['tree', 'lrTax', 'Arten'],
      ['tree', 'lr', 'tax1'],
    ])
  })

  it('recurses into children of an active object and closes siblings', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: ['Arten', 'tax1', 'obj1', 'child1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF', objectCount: [{ count: 1 }] }]),
        'tree/lr/tax1': list([
          { id: 'obj1', name: 'Objekt 1', objectCount: [{ count: 2 }] },
        ]),
        'tree/lrObject/obj1': list([
          { id: 'child1', name: 'Kind 1', objectCount: [{ count: 0 }] },
          { id: 'child2', name: 'Kind 2', objectCount: [{ count: 0 }] },
        ]),
      }).get,
    })

    expect(rows.map((r) => r.data?.label)).toEqual([
      'Arten',
      'CSCF',
      'Objekt 1',
      'Kind 1',
      'Kind 2',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
    ])
    expect(rows[3].data.url).toEqual(['Arten', 'tax1', 'obj1', 'child1'])
  })

  it('shows a loading row for a pending level', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: ['Arten', 'tax1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF', objectCount: [{ count: 2 }] }]),
        // 'tree/lr/tax1' not cached yet
      }).get,
    })

    expect(rows[2]).toEqual({ type: 'loading', level: 3 })
    expect(rows).toHaveLength(5)
  })

  it('shows a loading row for the children of an active object', () => {
    const { rows, queries } = buildTreeRows({
      activeNodeArray: ['Arten', 'tax1', 'obj1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF', objectCount: [{ count: 1 }] }]),
        'tree/lr/tax1': list([
          { id: 'obj1', name: 'Objekt 1', objectCount: [{ count: 2 }] },
        ]),
        // 'tree/lrObject/obj1' not cached yet
      }).get,
    })

    expect(rows[3]).toEqual({ type: 'loading', level: 4 })
    expect(queries.map((q) => q.queryKey)).toContainEqual([
      'tree',
      'lrObject',
      'obj1',
    ])
  })

  it('appends a more-row after an incomplete list', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: ['Arten'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF' }], {
          complete: false,
        }),
      }).get,
    })

    expect(rows[2]).toEqual({
      type: 'more',
      queryKey: ['tree', 'lrTax', 'Arten'],
      level: 2,
      loading: false,
    })
    expect(rows).toHaveLength(5)
  })

  it('reports a path hole when the url expects a child beyond the loaded pages', () => {
    const { pathHoles } = buildTreeRows({
      activeNodeArray: ['Arten', 'tax2'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF' }], {
          complete: false,
        }),
      }).get,
    })

    expect(pathHoles).toEqual([['tree', 'lrTax', 'Arten']])
  })

  it('reports no path hole when the expected child is loaded or the list complete', () => {
    const missingButComplete = buildTreeRows({
      activeNodeArray: ['Arten', 'tax2'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF' }]),
      }).get,
    })
    expect(missingButComplete.pathHoles).toEqual([])

    const loaded = buildTreeRows({
      activeNodeArray: ['Arten', 'tax1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Arten': list([{ id: 'tax1', name: 'CSCF' }], {
          complete: false,
        }),
      }).get,
    })
    expect(loaded.pathHoles).toEqual([])
  })

  it('renders the two static folder rows below an active property collection', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: ['Eigenschaften-Sammlungen', 'pc1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/pcs': list([
          {
            id: 'pc1',
            name: 'ZH GIS',
            pcoCount: [{ count: 4 }],
            relCount: [{ count: 2 }],
          },
        ]),
      }).get,
    })

    expect(rows.map((r) => r.data?.label)).toEqual([
      'Arten',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
      'ZH GIS',
      'Eigenschaften',
      'Beziehungen',
    ])
    expect(rows[3].data.info).toBe(6)
    expect(rows[4].data.url).toEqual([
      'Eigenschaften-Sammlungen',
      'pc1',
      'Eigenschaften',
    ])
    expect(rows[4].data.info).toBe(4)
    expect(rows[5].data.info).toBe(2)
  })

  it('lists users and organizations of open folders', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: ['Benutzer'],
      hasToken: true,
      getQueryData: makeCache({
        'tree/root/true': counts,
        'tree/users': list([{ id: 'user1', name: 'Alex' }]),
      }).get,
    })

    expect(rows.map((r) => r.data?.label)).toEqual([
      'Arten',
      'Lebensräume',
      'Eigenschaften-Sammlungen',
      'Benutzer',
      'Alex',
      'Organisationen',
    ])
    expect(rows[4].data.url).toEqual(['Benutzer', 'user1'])
    expect(rows[4].data.childrenCount).toBe(0)
  })

  it('expands along a Lebensräume path', () => {
    const { rows } = buildTreeRows({
      activeNodeArray: ['Lebensräume', 'lrTax1'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
        'tree/lrTax/Lebensräume': list([
          { id: 'lrTax1', name: 'Delarze', objectCount: [{ count: 5 }] },
        ]),
        'tree/lr/lrTax1': list(
          [{ id: 'lr1', name: 'LR 1', objectCount: [{ count: 0 }] }],
        ),
      }).get,
    })

    expect(rows.map((r) => r.data?.label)).toEqual([
      'Arten',
      'Lebensräume',
      'Delarze',
      'LR 1',
      'Eigenschaften-Sammlungen',
    ])
    expect(rows[3].data.url).toEqual(['Lebensräume', 'lrTax1', 'lr1'])
  })
})

describe('list queryFn', () => {
  it('fetches the initial page and wraps the result', async () => {
    apiFetch.mockResolvedValueOnce([{ id: 'tax1', name: 'CSCF' }])
    const { queries } = buildTreeRows({
      activeNodeArray: ['Arten'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
      }).get,
    })
    const taxonomiesQuery = queries.find((q) =>
      q.queryKey.includes('lrTax'),
    )

    // the query client reaches the queryFn as `client` in its context
    const client = { getQueryData: () => undefined }
    const result = await taxonomiesQuery.queryFn({
      queryKey: taxonomiesQuery.queryKey,
      client,
    })

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`&limit=${treePageSize}`),
    )
    expect(result).toEqual({
      rows: [{ id: 'tax1', name: 'CSCF' }],
      complete: true,
      loading: false,
    })
  })

  it('refetches at least as many rows as were loaded before', async () => {
    apiFetch.mockResolvedValueOnce([])
    const { queries } = buildTreeRows({
      activeNodeArray: ['Arten'],
      hasToken: false,
      getQueryData: makeCache({
        'tree/root/false': counts,
      }).get,
    })
    const taxonomiesQuery = queries.find((q) =>
      q.queryKey.includes('lrTax'),
    )

    const client = {
      getQueryData: () => ({ rows: Array.from({ length: 1200 }) }),
    }
    await taxonomiesQuery.queryFn({
      queryKey: taxonomiesQuery.queryKey,
      client,
    })

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('&limit=1200'),
    )
  })
})

describe('fetchMoreTreeRows', () => {
  const makeClient = (initial) => {
    const cache = new Map([[initial.key.join('/'), { ...initial.value }]])
    return {
      getQueryData: (key) => cache.get(key.join('/')),
      setQueryData: (key, valueOrUpdater) => {
        const k = key.join('/')
        const current = cache.get(k)
        cache.set(
          k,
          typeof valueOrUpdater === 'function' ?
            valueOrUpdater(current)
          : valueOrUpdater,
        )
      },
    }
  }

  it('fetches the next page at the cached offset and appends deduped', async () => {
    apiFetch.mockResolvedValueOnce([
      { id: 'row3', name: 'Row 3' },
      { id: 'row1', name: 'duplicate' },
    ])
    const client = makeClient({
      key: ['tree', 'lrTax', 'Arten'],
      value: list([{ id: 'row1' }, { id: 'row2' }], { complete: false }),
    })

    await fetchMoreTreeRows(client, ['tree', 'lrTax', 'Arten'])

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`&limit=${treePageSize}&offset=2`),
    )
    expect(client.getQueryData(['tree', 'lrTax', 'Arten'])).toEqual({
      rows: [{ id: 'row1' }, { id: 'row2' }, { id: 'row3', name: 'Row 3' }],
      // a page smaller than treePageSize ends the list
      complete: true,
      loading: false,
    })
  })

  it('marks the list complete when the page is not full', async () => {
    apiFetch.mockResolvedValueOnce([{ id: 'row3' }])
    const client = makeClient({
      key: ['tree', 'lr', 'tax1'],
      value: list([{ id: 'row1' }], { complete: false }),
    })

    await fetchMoreTreeRows(client, ['tree', 'lr', 'tax1'])

    expect(client.getQueryData(['tree', 'lr', 'tax1']).complete).toBe(true)
  })

  it('does nothing while another fetch is in flight', async () => {
    const client = makeClient({
      key: ['tree', 'pcs'],
      value: list([{ id: 'pc1' }], { complete: false, loading: true }),
    })

    await fetchMoreTreeRows(client, ['tree', 'pcs'])

    expect(apiFetch).not.toHaveBeenCalled()
  })

  it('resets loading on error and rethrows', async () => {
    apiFetch.mockRejectedValueOnce(new Error('network'))
    const client = makeClient({
      key: ['tree', 'orgs'],
      value: list([{ id: 'org1' }], { complete: false }),
    })

    await expect(
      fetchMoreTreeRows(client, ['tree', 'orgs']),
    ).rejects.toThrow('network')

    expect(client.getQueryData(['tree', 'orgs']).loading).toBe(false)
  })
})

describe('rootCountsQuery', () => {
  it('counts anonymous resources only', async () => {
    const { apiCount } = await import('../../modules/api.js')
    apiCount.mockResolvedValue(1)
    const { queryFn } = rootCountsQuery(false)

    const result = await queryFn()

    expect(apiCount).toHaveBeenCalledTimes(3)
    expect(result).toEqual({
      arten: 1,
      lebensraeume: 1,
      pcs: 1,
      users: 0,
      organizations: 0,
    })
  })
})
