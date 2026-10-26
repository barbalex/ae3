import { describe, it, expect, vi } from 'vitest'

import FileSaver from 'file-saver'

import { exportCsv } from './exportCsv.js'

vi.mock('file-saver', () => ({
  default: { saveAs: vi.fn() },
}))

describe('exportCsv', () => {
  it('downloads the rows as csv with a timestamped filename', async () => {
    exportCsv([
      { Art: 'Apfel', Gruppe: 'Pflanzen' },
      { Art: 'Birne', Gruppe: 'Pflanzen' },
    ])

    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1)
    const [blob, filename] = FileSaver.saveAs.mock.calls[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(await blob.text()).toBe(
      '"Art","Gruppe"\n"Apfel","Pflanzen"\n"Birne","Pflanzen"',
    )
    expect(filename).toMatch(
      /^arteigenschaften_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/,
    )
  })
})
