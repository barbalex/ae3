import { describe, it, expect, vi, type Mock } from 'vitest'

import FileSaver from 'file-saver'

import { exportXlsx, exportXlsxFromPages } from './exportXlsx'
import { getXlsxBuffer } from './getXlsxBuffer'
import { runInWorkerStream } from './runInWorker'

vi.mock('file-saver', () => ({
  default: { saveAs: vi.fn() },
}))
vi.mock('./getXlsxBuffer', () => ({
  getXlsxBuffer: vi.fn(),
}))
vi.mock('./runInWorker', () => ({
  runInWorkerStream: vi.fn(),
}))

const getXlsxBufferMock: Mock = vi.mocked(getXlsxBuffer)
const runInWorkerStreamMock: Mock = vi.mocked(runInWorkerStream)
const saveAsMock: Mock = vi.mocked(FileSaver.saveAs)

describe('exportXlsx', () => {
  it('saves the xlsx buffer with a timestamped filename', async () => {
    getXlsxBufferMock.mockResolvedValue(new ArrayBuffer(8))

    await exportXlsx({ rows: [], onSetMessage: vi.fn() })

    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1)
    const [blob, filename] = saveAsMock.mock.calls[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(filename).toMatch(
      /^arteigenschaften_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.xlsx$/,
    )
  })

  it('reports an error when building the buffer fails', async () => {
    getXlsxBufferMock.mockRejectedValue(new Error('boom'))
    const onSetMessage = vi.fn()

    await exportXlsx({ rows: [], onSetMessage })

    expect(onSetMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: 'boom',
    }))
  })

  it('saves the buffer built from streamed pages', async () => {
    runInWorkerStreamMock.mockResolvedValue(new ArrayBuffer(8))
    const pages = (async function* () {
      yield [{ Art: 'Apfel' }]
      yield [{ Art: 'Birne' }]
    })()

    await exportXlsxFromPages({ columns: ['Art'], pages })

    expect(runInWorkerStream).toHaveBeenCalledWith(
      expect.objectContaining({ columns: ['Art'], pages }),
    )
    const [blob, filename] = saveAsMock.mock.calls.at(-1)!
    expect(blob).toBeInstanceOf(Blob)
    expect(filename).toMatch(/\.xlsx$/)
  })
})
