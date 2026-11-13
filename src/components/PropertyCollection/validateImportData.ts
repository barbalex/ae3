import { omit, uniq } from 'es-toolkit'
import { some } from 'es-toolkit/compat'

import { isUuid } from '../../modules/isUuid'

// per-row validation results; all undefined until a file is dropped.
// keys not used by a collection kind are simply never set
export type ImportCheckState = Record<string, boolean | undefined>

export const getImportDataFields = (importData: any[]) => {
  let fields: string[] = []
  importData.forEach((d) => {
    fields = uniq([...fields, ...Object.keys(d)])
  })
  return fields
}

const containsNone = (values: any[], char: string) =>
  !some(values, (k) => {
    if (!k || !k.includes) return false
    return k.includes(char)
  })

// validates one id column: sets the exist/uuid checks and returns the ids
const checkIdField = ({
  checkState,
  importDataFields,
  data,
  dataKey,
  existsKey,
  uuidKey,
}: {
  checkState: ImportCheckState
  importDataFields: string[]
  data: any[]
  dataKey: string
  existsKey: string
  uuidKey: string
}) => {
  const fieldExists = importDataFields.includes(dataKey)
  checkState[existsKey] = fieldExists
  checkState[uuidKey] = fieldExists ?
    data.filter((d: any) => !isUuid(d[dataKey])).length === 0
  : undefined
  return data
    .map((d: any) => d[dataKey])
    .filter((d: any) => d !== undefined)
}

export type ImportValidation = {
  checkState: ImportCheckState
  importDataFields: string[]
  objectIds: any[]
  objectRelationIds: any[]
  pCOfOriginIds: any[]
}

// validates a parsed import file: fills the checks driving the
// instructions checklist and the import button, and returns the id
// columns that the caller must verify against the db (existence check
// via the import query in ImportCollection)
export const validateImportData = (
  data: any[],
  relation?: {
    dataKey: 'objectIdRelation'
    existsKey: string
    uuidKey: string
    realNotTestedKey: string
  },
  requiresRelationType?: boolean,
): ImportValidation => {
  const checkState: ImportCheckState = {}
  const importDataFields = getImportDataFields(data)

  checkState.existsNoDataWithoutKey =
    data.filter((d: any) => !!d.__EMPTY).length === 0
  const ids = data.map((d: any) => d.id).filter((d: any) => d !== undefined)
  const idsExist = ids.length > 0
  checkState.idsExist = idsExist
  checkState.idsAreUuids =
    idsExist ? !ids.map((d: any) => isUuid(d)).includes(false) : undefined
  checkState.idsAreUnique =
    idsExist ? ids.length === new Set(ids).size : undefined

  const objectIds = checkIdField({
    checkState,
    importDataFields,
    data,
    dataKey: 'objectId',
    existsKey: 'objectIdsExist',
    uuidKey: 'objectIdsAreUuid',
  })

  let objectRelationIds: any[] = []
  if (relation) {
    objectRelationIds = checkIdField({
      checkState,
      importDataFields,
      data,
      dataKey: relation.dataKey,
      existsKey: relation.existsKey,
      uuidKey: relation.uuidKey,
    })
  }
  if (requiresRelationType) {
    // relationType is carried along with objectIdRelation; a row
    // without it cannot match the unique constraint
    const relationTypes = data
      .map((d: any) => d.relationType)
      .filter((d: any) => d !== undefined)
    checkState.relationTypeExist =
      importDataFields.includes('objectIdRelation') &&
      relationTypes.length === data.length
  }

  const pCOfOriginIds = data
    .map((d: any) => d.propertyCollectionOfOrigin)
    .filter((d: any) => d !== undefined)
  const uniquePCOfOriginIds = [...new Set(pCOfOriginIds)]
  const pCOfOriginIdsExist = uniquePCOfOriginIds.length > 0
  checkState.pCOfOriginIdsExist = pCOfOriginIdsExist
  checkState.pCOfOriginIdsAreUuid =
    pCOfOriginIdsExist ?
      !uniquePCOfOriginIds.map((d: any) => isUuid(d)).includes(false)
    : undefined

  const propertyKeys = uniq<any>(
    data
      .map((d: any) => Object.keys(omit(d, ['id', 'objectId'])))
      ?.flat?.(),
  )
  const existsPropertyKey = propertyKeys.length > 0
  checkState.existsPropertyKey = existsPropertyKey
  checkState.propertyKeysDontContainApostroph =
    existsPropertyKey ? containsNone(propertyKeys, '"') : undefined
  checkState.propertyKeysDontContainBackslash =
    existsPropertyKey ? containsNone(propertyKeys, '\\') : undefined
  const propertyValues = uniq<any>(
    data.map((d: any) => Object.values(d))?.flat?.(),
  )
  checkState.propertyValuesDontContainApostroph = containsNone(
    propertyValues,
    '"',
  )
  checkState.propertyValuesDontContainBackslash = containsNone(
    propertyValues,
    '\\',
  )

  return {
    checkState,
    importDataFields,
    objectIds,
    objectRelationIds,
    pCOfOriginIds: uniquePCOfOriginIds,
  }
}
