import { describe, it, expect, vi } from 'vitest'

import FileSaver from 'file-saver'

import { exportXlsx } from './exportXlsx.js'
import { getXlsxBuffer } from './getXlsxBuffer.js'

vi.mock('file-saver', () => ({
  default: { saveAs: vi.fn() },
}))
vi.mock('./getXlsxBuffer.js', () => ({
  getXlsxBuffer: vi.fn(),
}))

describe('exportXlsx', () => {
  it('saves the xlsx buffer with a timestamped filename', async () => {
    getXlsxBuffer.mockResolvedValue(new ArrayBuffer(8))

    await exportXlsx({ rows: [], onSetMessage: vi.fn() })

    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1)
    const [blob, filename] = FileSaver.saveAs.mock.calls[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(filename).toMatch(
      /^arteigenschaften_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.xlsx$/,
    )
  })

  it('reports an error when building the buffer fails', async () => {
    getXlsxBuffer.mockRejectedValue(new Error('boom'))
    const onSetMessage = vi.fn()

    await exportXlsx({ rows: [], onSetMessage })

    expect(onSetMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: 'boom',
    }))
  })
})
