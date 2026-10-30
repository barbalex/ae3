import { runInWorker } from './runInWorker.js'

const createWorker = () =>
  new Worker(new URL('../workers/xlsxImport.worker.js', import.meta.url), {
    type: 'module',
  })

/**
 * parses a spreadsheet for the pc/rco imports - off the main thread,
 * so big files cannot freeze the ui. @e965/xlsx is loaded inside the
 * worker only (see xlsxImportWork.js for the actual work). The
 * buffer is transferred, not copied
 */
export const parseImportFile = (arrayBuffer) =>
  runInWorker({
    createWorker,
    payload: arrayBuffer,
    transfer: [arrayBuffer],
  })
