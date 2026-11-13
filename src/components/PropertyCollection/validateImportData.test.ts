import { describe, expect, it } from 'vitest'

import { invalidUuids } from '../../modules/invalidUuids'
import { validateImportData } from './validateImportData'

const uuid1 = 'b0f28696-5b59-41cc-ba5a-87f7f1355a1c'
const uuid2 = '0fb5b155-85e2-4bb4-b9d1-e54a2f120a9f'
const pcUuid = '8ee0f7cf-9a72-4f0c-89d0-e6a3d1c2a0ff'

describe('validateImportData', () => {
  it('accepts a valid pco file', () => {
    const data = [
      { objectId: uuid1, Artname: 'Acer campestre' },
      { objectId: uuid2, Artname: 'Betula pendula' },
    ]
    const result = validateImportData(data)
    expect(result.checkState.existsNoDataWithoutKey).toBe(true)
    expect(result.checkState.objectIdsExist).toBe(true)
    expect(result.checkState.objectIdsAreUuid).toBe(true)
    expect(result.checkState.existsPropertyKey).toBe(true)
    expect(result.checkState.propertyKeysDontContainApostroph).toBe(true)
    expect(result.checkState.idsExist).toBe(false)
    expect(result.objectIds).toEqual([uuid1, uuid2])
    expect(result.objectRelationIds).toEqual([])
    expect(result.pCOfOriginIds).toEqual([])
  })

  it('rejects rows without key (the __EMPTY columns of a bad file)', () => {
    const data = [{ objectId: uuid1, __EMPTY: 'x' }]
    expect(validateImportData(data).checkState.existsNoDataWithoutKey).toBe(
      false,
    )
  })

  it('validates the id column when present', () => {
    const good = validateImportData([
      { id: uuid1, objectId: uuid2, prop: 1 },
      { id: uuid1, objectId: uuid2, prop: 2 },
    ])
    // duplicate ids: not unique
    expect(good.checkState.idsExist).toBe(true)
    expect(good.checkState.idsAreUuids).toBe(true)
    expect(good.checkState.idsAreUnique).toBe(false)

    const badUuid = validateImportData([{ id: 'not-a-uuid', objectId: uuid2 }])
    expect(badUuid.checkState.idsAreUuids).toBe(false)
  })

  it('flags missing or invalid objectIds', () => {
    const missing = validateImportData([{ Artname: 'x' }])
    expect(missing.checkState.objectIdsExist).toBe(false)
    expect(missing.checkState.objectIdsAreUuid).toBeUndefined()

    const invalid = validateImportData([{ objectId: 'abc', Artname: 'x' }])
    expect(invalid.checkState.objectIdsExist).toBe(true)
    expect(invalid.checkState.objectIdsAreUuid).toBe(false)
  })

  it('accepts the two legacy invalid uuids of arteigenschaften.ch', () => {
    for (const legacy of invalidUuids) {
      const result = validateImportData([{ objectId: legacy, prop: 1 }])
      expect(result.checkState.objectIdsAreUuid).toBe(true)
    }
  })

  it('validates relation fields when a relation spec is given', () => {
    const relation = {
      dataKey: 'objectIdRelation',
      existsKey: 'objectRelationIdsExist',
      uuidKey: 'objectRelationIdsAreUuid',
      realNotTestedKey: 'objectRelationIdsAreRealNotTested',
    } as const
    const data = [
      {
        objectId: uuid1,
        objectIdRelation: uuid2,
        relationType: 'host',
        prop: 1,
      },
    ]
    const result = validateImportData(data, relation, true)
    expect(result.checkState.objectRelationIdsExist).toBe(true)
    expect(result.checkState.objectRelationIdsAreUuid).toBe(true)
    expect(result.checkState.relationTypeExist).toBe(true)
    expect(result.objectRelationIds).toEqual([uuid2])

    // a row missing its relationType cannot match the unique constraint
    const incomplete = validateImportData(
      [{ objectId: uuid1, objectIdRelation: uuid2, prop: 1 }],
      relation,
      true,
    )
    expect(incomplete.checkState.relationTypeExist).toBe(false)
  })

  it('collects unique property-collection-of-origin ids', () => {
    const result = validateImportData([
      { objectId: uuid1, propertyCollectionOfOrigin: pcUuid, prop: 1 },
      { objectId: uuid2, propertyCollectionOfOrigin: pcUuid, prop: 2 },
    ])
    expect(result.checkState.pCOfOriginIdsExist).toBe(true)
    expect(result.checkState.pCOfOriginIdsAreUuid).toBe(true)
    expect(result.pCOfOriginIds).toEqual([pcUuid])
  })

  it('rejects quotes and backslashes in property keys and values', () => {
    const withQuote = validateImportData([{ objectId: uuid1, 'my"key': 1 }])
    expect(withQuote.checkState.propertyKeysDontContainApostroph).toBe(false)

    const withBackslash = validateImportData([{ objectId: uuid1, 'my\\key': 1 }])
    expect(withBackslash.checkState.propertyKeysDontContainBackslash).toBe(
      false,
    )

    const valueWithQuote = validateImportData([
      { objectId: uuid1, prop: 'has "quotes"' },
    ])
    expect(valueWithQuote.checkState.propertyValuesDontContainApostroph).toBe(
      false,
    )

    const valueWithBackslash = validateImportData([
      { objectId: uuid1, prop: 'has \\ backslash' },
    ])
    expect(
      valueWithBackslash.checkState.propertyValuesDontContainBackslash,
    ).toBe(false)
  })

  it('requires at least one property key', () => {
    // only id and objectId: nothing left after omitting them
    const result = validateImportData([{ id: uuid1, objectId: uuid2 }])
    expect(result.checkState.existsPropertyKey).toBe(false)

    // propertyCollectionOfOrigin is not omitted, so it counts as a key
    const withOrigin = validateImportData([
      { objectId: uuid1, propertyCollectionOfOrigin: pcUuid },
    ])
    expect(withOrigin.checkState.existsPropertyKey).toBe(true)
  })
})
