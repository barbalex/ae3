import FileSaver from 'file-saver'
import { format } from 'date-fns/format'

import { runInWorker, runInWorkerStream } from './runInWorker'

const createWorker = () =>
  new Worker(new URL('../workers/csvExport.worker.ts', import.meta.url), {
    type: 'module',
  })

/**
 * downloads the rows as csv - stringified off the main thread, so
 * big exports cannot freeze the ui. @json2csv is loaded inside the
 * worker only (see csvWork.js for the actual work)
 */
export const exportCsv = async (jsonData: any[]): Promise<void> => {
  const csvData = await runInWorker({ createWorker, payload: jsonData })
  FileSaver.saveAs(
    new Blob([csvData], { type: 'text/csv;charset=utf-8' }),
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`,
  )
}

export const exportCsvFromPages = async ({
  columns,
  pages,
}: {
  columns: string[]
  pages: AsyncIterable<any[]>
}): Promise<void> => {
  const csvChunks: any[] = []
  await runInWorkerStream({
    createWorker,
    columns,
    pages,
    onChunk: (chunk) => {
      if (chunk) csvChunks.push(chunk)
    },
  })
  if (!csvChunks.length) return

  FileSaver.saveAs(
    new Blob(csvChunks, { type: 'text/csv;charset=utf-8' }),
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`,
  )
}
