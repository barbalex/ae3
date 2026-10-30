import { describe, it, expect, vi } from 'vitest'

import { attachParentChain, attachParentIds } from './attachParentChain.js'
import { rpc } from './api.js'

vi.mock('./api.js', () => ({
  rpc: vi.fn(),
}))

describe('attachParentIds', () => {
  it('nests the ids from the direct parent up to the root', () => {
    const object = { id: 'object' }

    attachParentIds(object, ['parent', 'grandparent', 'root'])

    expect(object.objectByParentId).toEqual({
      id: 'parent',
      objectByParentId: {
        id: 'grandparent',
        objectByParentId: { id: 'root' },
      },
    })
  })

  it('returns the object unchanged without parents', () => {
    const object = { id: 'object' }

    expect(attachParentIds(object, [])).toBe(object)
    expect(object.objectByParentId).toBeUndefined()
  })
})

describe('attachParentChain', () => {
  it('attaches the rpc path in one request', async () => {
    rpc.mockResolvedValueOnce([
      // root-first, the object itself last
      { object_id: 'root' },
      { object_id: 'grandparent' },
      { object_id: 'parent' },
      { object_id: 'object' },
    ])

    const object = await attachParentChain({ id: 'object' })

    expect(rpc).toHaveBeenCalledTimes(1)
    expect(rpc).toHaveBeenCalledWith('object_path', {
      p_object_id: 'object',
    })
    expect(object.objectByParentId).toEqual({
      id: 'parent',
      objectByParentId: {
        id: 'grandparent',
        objectByParentId: { id: 'root' },
      },
    })
  })

  it('attaches nothing for a top level object', async () => {
    rpc.mockResolvedValueOnce([{ object_id: 'object' }])

    const object = await attachParentChain({ id: 'object' })

    expect(object.objectByParentId).toBeUndefined()
  })

  it('does not call the rpc without an object id', async () => {
    const object = await attachParentChain({})

    expect(rpc).not.toHaveBeenCalled()
    expect(object).toEqual({})
  })
})
