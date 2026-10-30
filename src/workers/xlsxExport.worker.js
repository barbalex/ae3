/// <reference lib="webworker" />
import { buildXlsxBuffer } from '../modules/xlsxWork.js'

self.onmessage = async (event) => {
  const { id, payload } = event.data
  try {
    const buffer = await buildXlsxBuffer(payload)
    self.postMessage({ id, result: buffer }, [buffer])
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
