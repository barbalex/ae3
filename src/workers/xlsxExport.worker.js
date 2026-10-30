/// <reference lib="webworker" />
import { buildXlsxBuffer } from '../modules/xlsxWork.js'

self.onmessage = async (event) => {
  const { id, payload } = event.data
  try {
    const buffer = await buildXlsxBuffer(payload)
    // XLSX.write(type: 'array') returns a transferable ArrayBuffer
    self.postMessage({ id, result: buffer }, [buffer])
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
