import { describe, it, expect } from 'vitest'

import { isUuid } from './isUuid.js'
import { invalidUuids } from './invalidUuids.js'

describe('isUuid', () => {
  it('accepts valid uuids', () => {
    expect(isUuid('6d34b407-4803-4b45-83e2-91da1b5f0de6')).toBe(true)
  })

  it('accepts the historic invalid uuids of arteigenschaften.ch', () => {
    for (const uuid of invalidUuids) {
      expect(isUuid(uuid)).toBe(true)
    }
  })

  it('rejects non-uuids', () => {
    expect(isUuid('not-a-uuid')).toBe(false)
    expect(isUuid('')).toBe(false)
    expect(isUuid(null)).toBe(false)
    expect(isUuid(undefined)).toBe(false)
  })
})
