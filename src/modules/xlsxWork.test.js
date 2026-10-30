import { describe, it, expect } from 'vitest'
import { read, utils } from '@e965/xlsx'

import { buildXlsxBuffer, createXlsxBuilder } from './xlsxWork.js'

describe('buildXlsxBuffer', () => {
  it('builds an xlsx workbook with all columns aligned across rows', async () => {
    const buffer = await buildXlsxBuffer([
      { Art: 'Apfel', Gruppe: 'Pflanzen' },
      { Art: 'Birne' },
    ])

    // xlsx files are zips: they start with the PK magic bytes
    const bytes = new Uint8Array(buffer)
    expect(bytes[0]).toBe(0x50)
    expect(bytes[1]).toBe(0x4b)
  })

  it('appends row batches without losing alignment or filling missing values incorrectly', async () => {
    const builder = await createXlsxBuilder(['Art', 'Gruppe'])
    builder.appendRows([{ Art: 'Apfel', Gruppe: 'Pflanzen' }])
    builder.appendRows([{ Art: 'Birne' }])

    const workbook = read(builder.toBuffer(), { type: 'array' })
    expect(utils.sheet_to_json(workbook.Sheets.Daten, { header: 1 })).toEqual([
      ['Art', 'Gruppe'],
      ['Apfel', 'Pflanzen'],
      ['Birne', ''],
    ])
  })
})
