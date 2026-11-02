import { describe, it, expect, vi, type Mock } from 'vitest'

import { bulkUpsert } from './bulkUpsert'
import { apiFetch } from './api'

vi.mock('./api', () => ({
  apiFetch: vi.fn(),
}))

const apiFetchMock: Mock = vi.mocked(apiFetch)

describe('bulkUpsert', () => {
  it('upserts all rows in one call when they fit one chunk', async () => {
    apiFetchMock.mockResolvedValue(null)
    const rows = [{ object_id: 'a' }, { object_id: 'b' }]

    await bulkUpsert({
      path: '/property_collection_object',
      onConflict: 'object_id,property_collection_id',
      rows,
    })

    expect(apiFetch).toHaveBeenCalledTimes(1)
    const [url, options] = apiFetchMock.mock.calls[0]
    expect(url).toBe(
      '/property_collection_object?on_conflict=object_id,property_collection_id',
    )
    expect(options.method).toBe('POST')
    expect(options.headers['Prefer']).toBe(
      'resolution=merge-duplicates,return=minimal',
    )
    expect(options.body).toBe(JSON.stringify(rows))
  })

  it('chunks large imports and reports progress per chunk', async () => {
    apiFetchMock.mockResolvedValue(null)
    const rows = Array.from({ length: 1201 }, (_, i) => ({ n: i }))
    const done: number[] = []

    await bulkUpsert({
      path: '/relation',
      onConflict: 'property_collection_id,object_id',
      rows,
      chunkSize: 500,
      onChunkDone: (n) => done.push(n),
    })

    expect(apiFetch).toHaveBeenCalledTimes(3)
    expect(JSON.parse(apiFetchMock.mock.calls[0][1].body)).toHaveLength(500)
    expect(JSON.parse(apiFetchMock.mock.calls[1][1].body)).toHaveLength(500)
    expect(JSON.parse(apiFetchMock.mock.calls[2][1].body)).toHaveLength(201)
    expect(done).toEqual([500, 500, 201])
  })

  it('rejects on a failing chunk and stops sending further ones', async () => {
    apiFetchMock
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('conflict'))

    await expect(
      bulkUpsert({
        path: '/relation',
        onConflict: 'object_id',
        rows: Array.from({ length: 700 }, (_, i) => ({ n: i })),
        chunkSize: 500,
      }),
    ).rejects.toThrow('conflict')

    expect(apiFetch).toHaveBeenCalledTimes(2)
  })
})
