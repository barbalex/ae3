import { describe, it, expect, vi } from 'vitest'

import fileDownload from 'js-file-download'

import { exportCsv } from './exportCsv.js'

vi.mock('js-file-download', () => ({ default: vi.fn() }))

describe('exportCsv', () => {
  it('downloads the rows as csv with a timestamped filename', () => {
    exportCsv([
      { Art: 'Apfel', Gruppe: 'Pflanzen' },
      { Art: 'Birne', Gruppe: 'Pflanzen' },
    ])

    expect(fileDownload).toHaveBeenCalledTimes(1)
    const [csv, filename] = fileDownload.mock.calls[0]
    expect(csv).toBe(
      '"Art","Gruppe"\n"Apfel","Pflanzen"\n"Birne","Pflanzen"',
    )
    expect(filename).toMatch(
      /^arteigenschaften_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/,
    )
  })
})
