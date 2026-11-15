import {
  createDefaultExportConfig,
  type ExportConfig,
  type PcoFilter,
  type PcoProperty,
  type RcoFilter,
  type RcoProperty,
  type TaxFilter,
  type TaxProperty,
} from '../store'

// name of the search param carrying the serialised export configuration
export const exportConfigParamName = 'c'

// bump when the wire format changes and handle old versions in decodeExportConfig
const version = 1

// base64url avoids '+' and '/' so the value survives URLSearchParams
// round-trips (and hand-copied links) untouched
const toBase64Url = (bytes: Uint8Array): string => {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

const fromBase64Url = (value: string): Uint8Array => {
  // spaces stand for '+' when a link went through form-encoding somewhere
  const base64 = value
    .replaceAll('-', '+')
    .replaceAll('_', '/')
    .replaceAll(' ', '+')
  const binary = atob(base64)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

// encodeExportConfig is deterministic: the object literal in
// exportConfigAtom and the one below share a fixed key order, so encoding
// the same config twice yields the same string
export const encodeExportConfig = (config: ExportConfig): string =>
  toBase64Url(
    new TextEncoder().encode(JSON.stringify({ v: version, ...config })),
  )

export const defaultExportConfigEncoded = encodeExportConfig(
  createDefaultExportConfig(),
)

// helpers return undefined when a *present* value does not fit the expected
// shape; absent keys fall back to the given default instead, so minimal
// hand-made links work. decodeExportConfig treats undefined as a broken link
// and falls back to defaults rather than silently dropping parts
const stringOrNull = (value: unknown): string | null | undefined =>
  typeof value === 'string' || value === null || value === undefined
    ? (value ?? null)
    : undefined

const stringList = (
  value: unknown,
  fallback: string[],
): string[] | undefined =>
  value === undefined
    ? fallback
    : Array.isArray(value) && value.every((item) => typeof item === 'string')
      ? value
      : undefined

const bool = (value: unknown, fallback: boolean): boolean | undefined =>
  value === undefined ? fallback : typeof value === 'boolean' ? value : undefined

// keeps the allowed keys, requires every value to be a primitive; missing
// keys become null, unknown keys are dropped
const itemList = <T>(
  value: unknown,
  allowedKeys: string[],
  fallback: T[],
): T[] | undefined => {
  if (value === undefined) return fallback
  if (!Array.isArray(value)) return undefined
  const items: Record<string, unknown>[] = []
  for (const item of value) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return undefined
    }
    const cleaned: Record<string, unknown> = {}
    for (const key of allowedKeys) {
      const itemValue = (item as Record<string, unknown>)[key]
      if (
        itemValue != null &&
        !['string', 'number', 'boolean'].includes(typeof itemValue)
      ) {
        return undefined
      }
      cleaned[key] = itemValue ?? null
    }
    items.push(cleaned)
  }
  return items as T[]
}

export const decodeExportConfig = (encoded: string): ExportConfig | null => {
  let wire: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encoded)),
    )
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null
    }
    wire = parsed as Record<string, unknown>
  } catch {
    return null
  }
  if (wire.v !== version) return null

  const defaults = createDefaultExportConfig()
  const type = stringOrNull(wire.type)
  const taxonomies = stringList(wire.taxonomies, defaults.taxonomies)
  const ids = stringList(wire.ids, defaults.ids)
  const taxProperties = itemList<TaxProperty>(
    wire.taxProperties,
    ['taxname', 'pname'],
    defaults.taxProperties,
  )
  const pcoProperties = itemList<PcoProperty>(
    wire.pcoProperties,
    ['pcname', 'pname'],
    defaults.pcoProperties,
  )
  const rcoProperties = itemList<RcoProperty>(
    wire.rcoProperties,
    ['pcname', 'relationtype', 'pname'],
    defaults.rcoProperties,
  )
  const taxFilters = itemList<TaxFilter>(
    wire.taxFilters,
    ['taxname', 'pname', 'comparator', 'value'],
    defaults.taxFilters,
  )
  const pcoFilters = itemList<PcoFilter>(
    wire.pcoFilters,
    ['pcname', 'pname', 'comparator', 'value'],
    defaults.pcoFilters,
  )
  const rcoFilters = itemList<RcoFilter>(
    wire.rcoFilters,
    ['pcname', 'relationtype', 'pname', 'comparator', 'value'],
    defaults.rcoFilters,
  )
  const withSynonymData = bool(wire.withSynonymData, true)
  const addFilterFields = bool(wire.addFilterFields, true)

  if (
    type === undefined ||
    taxonomies === undefined ||
    ids === undefined ||
    taxProperties === undefined ||
    pcoProperties === undefined ||
    rcoProperties === undefined ||
    taxFilters === undefined ||
    pcoFilters === undefined ||
    rcoFilters === undefined ||
    withSynonymData === undefined ||
    addFilterFields === undefined
  ) {
    return null
  }

  return {
    type,
    taxonomies,
    ids,
    taxProperties,
    pcoProperties,
    rcoProperties,
    taxFilters,
    pcoFilters,
    rcoFilters,
    withSynonymData,
    addFilterFields,
  }
}
