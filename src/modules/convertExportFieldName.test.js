import { describe, it, expect } from 'vitest'

import { convertExportFieldName } from './convertExportFieldName.js'

describe('convertExportFieldName', () => {
  it('replaces spaces with hyphens and drops parentheses', () => {
    expect(convertExportFieldName('Artgruppe (V)')).toBe('Artgruppe-V')
    expect(convertExportFieldName('Taxonomie ID')).toBe('Taxonomie-ID')
    expect(convertExportFieldName('Name Deutsch')).toBe('Name-Deutsch')
  })

  it('returns non-string values unchanged', () => {
    expect(convertExportFieldName(42)).toBe(42)
    expect(convertExportFieldName(null)).toBe(null)
    expect(convertExportFieldName(undefined)).toBe(undefined)
  })
})
