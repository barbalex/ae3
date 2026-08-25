import { describe, it, expect } from 'vitest'

import { getLastIdFromUrl } from './getLastIdFromUrl.js'

const uuid = '6d34b407-4803-4b45-83e2-91da1b5f0de6'

describe('getLastIdFromUrl', () => {
  it('returns the last element when it is a uuid', () => {
    expect(getLastIdFromUrl(['Arten', 'taxId', uuid])).toBe(uuid)
  })

  it('searches backwards until it finds a uuid', () => {
    expect(getLastIdFromUrl(['Arten', uuid, 'Eigenschaften'])).toBe(uuid)
  })

  it('returns undefined when no element is a uuid', () => {
    expect(getLastIdFromUrl(['Arten', 'taxId'])).toBeUndefined()
    expect(getLastIdFromUrl([])).toBeUndefined()
  })

  it('returns undefined for empty input', () => {
    expect(getLastIdFromUrl()).toBeUndefined()
  })
})
