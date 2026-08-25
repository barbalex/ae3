import { describe, it, expect } from 'vitest'

import { getActiveNodeArrayFromPathname } from './getActiveNodeArrayFromPathname.js'

// pushState changes window.location in jsdom without triggering navigation
const setPathname = (pathname) => window.history.pushState({}, '', pathname)

describe('getActiveNodeArrayFromPathname', () => {
  it('returns an empty array for the root path', () => {
    setPathname('/')
    expect(getActiveNodeArrayFromPathname()).toEqual([])
  })

  it('splits the pathname into elements', () => {
    setPathname('/Arten/taxId')
    expect(getActiveNodeArrayFromPathname()).toEqual(['Arten', 'taxId'])
  })

  it('ignores a trailing slash', () => {
    setPathname('/Arten/')
    expect(getActiveNodeArrayFromPathname()).toEqual(['Arten'])
  })

  it('converts numeric elements to numbers', () => {
    setPathname('/Benutzer/123')
    expect(getActiveNodeArrayFromPathname()).toEqual(['Benutzer', 123])
  })

  it('decodes uri-encoded elements', () => {
    setPathname('/Arten/S%C3%BCsswasserfische')
    expect(getActiveNodeArrayFromPathname()).toEqual([
      'Arten',
      'Süsswasserfische',
    ])
  })
})
