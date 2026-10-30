import FileSaver from 'file-saver'
import format from 'date-fns/format'
import { runInWorkerStream } from './runInWorker.js'

// the workbook is built off the main thread (see getXlsxBuffer.js)

export const exportXlsx = async ({ rows, onSetMessage }) => {
  const { getXlsxBuffer } = await import('./getXlsxBuffer.js')
  let buffer
  try {
    buffer = await getXlsxBuffer(rows)
  } catch (error) {
    console.log(error)
    onSetMessage(error)
    // do not save a file built from undefined
    return
  }
  FileSaver.saveAs(
    new Blob([buffer], {
      type: 'application/octet-stream',
    }),
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`,
  )
}

export const exportXlsxFromPages = async ({ columns, pages, onSetMessage }) => {
  const createWorker = () =>
    new Worker(new URL('../workers/xlsxExport.worker.js', import.meta.url), {
      type: 'module',
    })
  let buffer
  try {
    buffer = await runInWorkerStream({ createWorker, columns, pages })
  } catch (error) {
    console.log(error)
    onSetMessage?.(error)
    return
  }
  if (!buffer) return

  FileSaver.saveAs(
    new Blob([buffer], { type: 'application/octet-stream' }),
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`,
  )
}
