import { describe, it, expect } from 'vitest'

import { createDefaultExportConfig } from '../store'
import {
  decodeExportConfig,
  defaultExportConfigEncoded,
  encodeExportConfig,
} from './exportConfigUrl'

const fullConfig = {
  ...createDefaultExportConfig(),
  type: 'xlsx',
  taxonomies: ['abeaa0bd-1ff0-4de0-8f4f-1b9cb0c66919'],
  ids: ['0c9589a5-1f31-4f47-a6c1-3f569e5b8cf1'],
  taxProperties: [{ taxname: 'Taxonomie', pname: 'Artname' }],
  pcoProperties: [{ pcname: 'CS 2000', pname: 'Artwert' }],
  rcoProperties: [
    { pcname: 'CS 2000', relationtype: 'lebt bei', pname: 'Bemerkung' },
  ],
  taxFilters: [
    { taxname: 'Taxonomie', pname: 'Artname', comparator: 'LIKE', value: 42 },
  ],
  pcoFilters: [
    {
      pcname: 'CS 2000',
      pname: 'Bemerkungen',
      comparator: '=',
      value: 'enthält Umlaute: äöü',
    },
  ],
  rcoFilters: [
    {
      pcname: 'CS 2000',
      relationtype: null,
      pname: null,
      comparator: null,
      value: null,
    },
  ],
  withSynonymData: false,
  addFilterFields: false,
}

describe('exportConfigUrl', () => {
  it('round-trips a fully configured export', () => {
    expect(decodeExportConfig(encodeExportConfig(fullConfig))).toEqual(
      fullConfig,
    )
  })

  it('round-trips the default config', () => {
    const defaults = createDefaultExportConfig()
    expect(decodeExportConfig(encodeExportConfig(defaults))).toEqual(defaults)
  })

  it('encodes deterministically', () => {
    expect(encodeExportConfig(fullConfig)).toBe(encodeExportConfig(fullConfig))
  })

  it('encodes the default config to a stable value', () => {
    expect(encodeExportConfig(createDefaultExportConfig())).toBe(
      defaultExportConfigEncoded,
    )
  })

  it('uses base64url: no +, / or = in the encoded value', () => {
    expect(encodeExportConfig(fullConfig)).not.toMatch(/[+/=]/)
  })

  it('accepts standard base64 alphabet with + and /', () => {
    const base64url = encodeExportConfig(fullConfig)
    const standard = base64url
      .replaceAll('-', '+')
      .replaceAll('_', '/')
    expect(decodeExportConfig(standard)).toEqual(fullConfig)
  })

  it('returns null for input that is not valid base64url/json', () => {
    expect(decodeExportConfig('')).toBeNull()
    expect(decodeExportConfig('!!!')).toBeNull()
    expect(decodeExportConfig('bm90IGpzb24')).toBeNull()
  })

  it('returns null for a wrong or missing version', () => {
    const noVersion = btoa('{"type":"xlsx"}')
    expect(decodeExportConfig(noVersion)).toBeNull()
    const wrongVersion = btoa('{"v":2,"type":"xlsx"}')
    expect(decodeExportConfig(wrongVersion)).toBeNull()
  })

  it('returns null when a list contains a non-conforming item', () => {
    const taxonomiesNotStrings = btoa('{"v":1,"taxonomies":[42]}')
    expect(decodeExportConfig(taxonomiesNotStrings)).toBeNull()
    const filterValueNotPrimitive = btoa(
      '{"v":1,"taxFilters":[{"taxname":"t","pname":"p","comparator":"=","value":{"x":1}}]}',
    )
    expect(decodeExportConfig(filterValueNotPrimitive)).toBeNull()
  })

  it('normalises missing item keys to null and drops unknown keys', () => {
    const encoded = btoa('{"v":1,"pcoProperties":[{"pcname":"CS 2000"}]}')
    expect(decodeExportConfig(encoded)).toEqual({
      ...createDefaultExportConfig(),
      pcoProperties: [{ pcname: 'CS 2000', pname: null }],
    })
  })

  it('fills absent top-level keys with defaults (minimal links)', () => {
    const encoded = btoa('{"v":1,"taxonomies":["Schweizer Artliste"]}')
    expect(decodeExportConfig(encoded)).toEqual({
      ...createDefaultExportConfig(),
      taxonomies: ['Schweizer Artliste'],
    })
  })
})
