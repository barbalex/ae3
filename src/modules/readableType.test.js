import { describe, it, expect } from 'vitest'

import { readableType } from './readableType.js'

describe('readableType', () => {
  it('translates known types to German labels', () => {
    expect(readableType('String')).toBe('Text')
    expect(readableType('Integer')).toBe('Ganzzahl')
    expect(readableType('Number')).toBe('Zahl')
    expect(readableType('Boolean')).toBe('ja/nein')
    expect(readableType('Array')).toBe('Liste von Werten')
  })

  it('passes unknown types through', () => {
    expect(readableType('UUID')).toBe('UUID')
  })
})
