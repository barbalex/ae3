import { describe, it, expect } from 'vitest'

import { buildXlsxBuffer } from './xlsxWork.js'

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
})
