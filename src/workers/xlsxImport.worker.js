/// <reference lib="webworker" />
import { parseXlsx } from '../modules/xlsxImportWork.js'

self.onmessage = async (event) => {
  const { id, payload } = event.data
  try {
    self.postMessage({ id, result: await parseXlsx(payload) })
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
