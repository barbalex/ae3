import { describe, it, expect } from 'vitest'

import {
  parseOpenSections,
  serializeOpenSections,
} from './openSectionsUrl'

describe('openSectionsUrl', () => {
  it('returns null when the param is absent (defaults apply)', () => {
    expect(parseOpenSections(null)).toBeNull()
  })

  it('returns an empty set for a present but empty value', () => {
    expect(parseOpenSections('')).toEqual(new Set())
  })

  it('parses a comma separated list, dropping empty segments', () => {
    expect(parseOpenSections('a,,b')).toEqual(new Set(['a', 'b']))
  })

  it('serialises a set of ids and round-trips with parse', () => {
    const ids = new Set([
      '6f0e6f86-0c1d-4f1f-8d6f-4a3b6efc1d11',
      '8a6b4be5-2c8b-4a67-9d99-1a5ac81c3b0e/0c9589a5-1f31-4f47-a6c1-3f569e5b8cf1',
    ])
    const serialized = serializeOpenSections(ids)
    expect(serialized).not.toContain(',,')
    expect(parseOpenSections(serialized)).toEqual(ids)
  })

  it('serialises an empty set to an empty value', () => {
    expect(serializeOpenSections(new Set())).toBe('')
  })
})
