import { describe, it, expect } from 'vitest'

import { getActiveObjectIdFromNodeArray } from './getActiveObjectIdFromNodeArray.js'

describe('getActiveObjectIdFromNodeArray', () => {
  it('returns the last element for deep Arten and Lebensräume paths', () => {
    expect(
      getActiveObjectIdFromNodeArray(['Arten', 'taxId', 'objectId']),
    ).toBe('objectId')
    expect(
      getActiveObjectIdFromNodeArray([
        'Lebensräume',
        'taxId',
        'objectId',
        'propertyCollectionId',
      ]),
    ).toBe('propertyCollectionId')
  })

  it('returns null for shallow paths', () => {
    expect(getActiveObjectIdFromNodeArray(['Arten', 'taxId'])).toBe(null)
    expect(getActiveObjectIdFromNodeArray(['Arten'])).toBe(null)
  })

  it('returns null for paths outside Arten and Lebensräume', () => {
    expect(getActiveObjectIdFromNodeArray(['Benutzer', 'a', 'b'])).toBe(null)
    expect(
      getActiveObjectIdFromNodeArray(['Eigenschaften-Sammlungen', 'a', 'b']),
    ).toBe(null)
  })
})
