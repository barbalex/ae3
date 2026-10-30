import { describe, it, expect } from 'vitest'

import { buildCsv } from './csvWork.js'

describe('buildCsv', () => {
  it('stringifies rows with headers', () => {
    expect(
      buildCsv([
        { Art: 'Apfel', Gruppe: 'Pflanzen' },
        { Art: 'Birne', Gruppe: 'Pflanzen' },
      ]),
    ).toBe('"Art","Gruppe"\n"Apfel","Pflanzen"\n"Birne","Pflanzen"')
  })

  it('escapes quotes in values', () => {
    expect(buildCsv([{ Name: 'der "Grosse" ' }])).toBe(
      '"Name"\n"der ""Grosse"" "',
    )
  })
})
