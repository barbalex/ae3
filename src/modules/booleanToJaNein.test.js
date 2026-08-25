import { describe, it, expect } from 'vitest'

import { booleanToJaNein } from './booleanToJaNein.js'

describe('booleanToJaNein', () => {
  it('translates true and false to ja and nein', () => {
    expect(booleanToJaNein(true)).toBe('ja')
    expect(booleanToJaNein(false)).toBe('nein')
  })

  it('also translates the string forms', () => {
    expect(booleanToJaNein('true')).toBe('ja')
    expect(booleanToJaNein('false')).toBe('nein')
  })
})
