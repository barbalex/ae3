import { describe, it, expect } from 'vitest'

import { buildCsv, buildCsvChunk } from './csvWork.js'

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

  it('builds CSV pages with only one header', () => {
    const first = buildCsvChunk(
      [{ Art: 'Apfel', Gruppe: 'Pflanzen' }],
      ['Art', 'Gruppe'],
      true,
    )
    const second = buildCsvChunk(
      [{ Art: 'Birne', Gruppe: 'Pflanzen' }],
      ['Art', 'Gruppe'],
      false,
    )

    expect(`${first}${second}`).toBe(
      '"Art","Gruppe"\n"Apfel","Pflanzen"\n"Birne","Pflanzen"',
    )
  })

  it('separates rows across CSV page chunks', () => {
    const first = buildCsvChunk(
      [{ Art: 'Apfel' }, { Art: 'Birne' }],
      ['Art'],
      true,
    )
    const second = buildCsvChunk([{ Art: 'Kirsche' }], ['Art'], false)

    expect(`${first}${second}`).toBe(
      '"Art"\n"Apfel"\n"Birne"\n"Kirsche"',
    )
  })
})
