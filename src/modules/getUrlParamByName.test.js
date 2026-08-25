import { describe, it, expect } from 'vitest'

import { getUrlParamByName } from './getUrlParamByName.js'

// pushState changes window.location in jsdom without triggering navigation
const setSearch = (search) => window.history.pushState({}, '', search)

describe('getUrlParamByName', () => {
  it('returns the value of an existing param', () => {
    setSearch('/?menu=Apfel')
    expect(getUrlParamByName('menu')).toBe('Apfel')
  })

  it('decodes plus signs as spaces', () => {
    setSearch('/?q=Apfel+Birne')
    expect(getUrlParamByName('q')).toBe('Apfel Birne')
  })

  it('decodes uri-encoded values', () => {
    setSearch('/?q=S%C3%BCsswasserfische')
    expect(getUrlParamByName('q')).toBe('Süsswasserfische')
  })

  it('returns null when the param is missing', () => {
    setSearch('/?other=1')
    expect(getUrlParamByName('menu')).toBe(null)
  })
})
