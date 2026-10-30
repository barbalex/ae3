import { runInWorker } from './runInWorker.js'

const createWorker = () =>
  new Worker(new URL('../workers/xlsxExport.worker.js', import.meta.url), {
    type: 'module',
  })

/**
 * writes a dataArray to an Excel workbook - off the main thread, so
 * big exports cannot freeze the ui. @e965/xlsx is loaded inside the
 * worker only (see xlsxWork.js for the actual work)
 */
export const getXlsxBuffer = (jsonArray) =>
  runInWorker({ createWorker, payload: jsonArray })
