import { describe, it, expect, vi } from 'vitest'

import FileSaver from 'file-saver'

import { exportCsv, exportCsvFromPages } from './exportCsv.js'
import { runInWorker, runInWorkerStream } from './runInWorker.js'

vi.mock('file-saver', () => ({
  default: { saveAs: vi.fn() },
}))
// the csv itself is built in the worker; its work module is covered
// by csvWork.test.js
vi.mock('./runInWorker.js', () => ({
  runInWorker: vi.fn(),
  runInWorkerStream: vi.fn(),
}))

describe('exportCsv', () => {
  it('downloads the worker result as csv with a timestamped filename', async () => {
    runInWorker.mockResolvedValue('"Art","Gruppe"\n"Apfel","Pflanzen"')

    await exportCsv([
      { Art: 'Apfel', Gruppe: 'Pflanzen' },
      { Art: 'Birne', Gruppe: 'Pflanzen' },
    ])

    expect(runInWorker).toHaveBeenCalledTimes(1)
    const { payload } = runInWorker.mock.calls[0][0]
    expect(payload).toEqual([
      { Art: 'Apfel', Gruppe: 'Pflanzen' },
      { Art: 'Birne', Gruppe: 'Pflanzen' },
    ])

    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1)
    const [blob, filename] = FileSaver.saveAs.mock.calls[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(await blob.text()).toBe('"Art","Gruppe"\n"Apfel","Pflanzen"')
    expect(filename).toMatch(
      /^arteigenschaften_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/,
    )
  })

  it('downloads CSV chunks from a page stream', async () => {
    runInWorkerStream.mockImplementation(({ onChunk }) => {
      onChunk('"Art","Gruppe"\n"Apfel","Pflanzen"')
      onChunk('\n"Birne","Pflanzen"')
      return Promise.resolve(true)
    })
    const pages = (async function* () {
      yield [{ Art: 'Apfel', Gruppe: 'Pflanzen' }]
      yield [{ Art: 'Birne', Gruppe: 'Pflanzen' }]
    })()

    await exportCsvFromPages({ columns: ['Art', 'Gruppe'], pages })

    expect(runInWorkerStream).toHaveBeenCalledWith(
      expect.objectContaining({ columns: ['Art', 'Gruppe'], pages }),
    )
    const [blob] = FileSaver.saveAs.mock.calls.at(-1)
    expect(await blob.text()).toBe(
      '"Art","Gruppe"\n"Apfel","Pflanzen"\n"Birne","Pflanzen"',
    )
  })
})
