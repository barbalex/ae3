import { describe, it, expect } from 'vitest'

import { exists } from './exists.js'

describe('exists', () => {
  it('returns false for undefined, null and empty string', () => {
    expect(exists(undefined)).toBe(false)
    expect(exists(null)).toBe(false)
    expect(exists('')).toBe(false)
  })

  it('returns true for meaningful values, including 0 and false', () => {
    expect(exists('value')).toBe(true)
    expect(exists(0)).toBe(true)
    expect(exists(false)).toBe(true)
    expect(exists([])).toBe(true)
  })
})
