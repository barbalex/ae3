import { describe, it, expect } from 'vitest'

import { getUrlForObject } from './getUrlForObject.js'

describe('getUrlForObject', () => {
  it('maps taxonomy type ART to the Arten route', () => {
    const object = {
      id: 'objectId',
      taxonomyByTaxonomyId: { id: 'taxId', type: 'ART' },
    }
    expect(getUrlForObject(object)).toEqual(['Arten', 'taxId', 'objectId'])
  })

  it('maps taxonomy type LEBENSRAUM to the Lebensräume route', () => {
    const object = {
      id: 'objectId',
      taxonomyByTaxonomyId: { id: 'taxId', type: 'LEBENSRAUM' },
    }
    expect(getUrlForObject(object)).toEqual([
      'Lebensräume',
      'taxId',
      'objectId',
    ])
  })

  it('prepends the parent chain from the topmost ancestor down', () => {
    const object = {
      id: 'level4',
      taxonomyByTaxonomyId: { id: 'taxId', type: 'ART' },
      objectByParentId: {
        id: 'level5',
        objectByParentId: {
          id: 'level6',
        },
      },
    }
    expect(getUrlForObject(object)).toEqual([
      'Arten',
      'taxId',
      'level6',
      'level5',
      'level4',
    ])
  })

  it('returns the object id alone when it has no taxonomy', () => {
    expect(getUrlForObject({ id: 'objectId' })).toEqual(['objectId'])
    expect(getUrlForObject()).toEqual([])
  })
})
