/// <reference lib="webworker" />
import { buildXlsxBuffer, createXlsxBuilder } from '../modules/xlsxWork.js'

let builder

self.onmessage = async (event) => {
  const { id, payload, action } = event.data
  try {
    if (action === 'start') {
      builder = await createXlsxBuilder(payload)
      self.postMessage({ id, result: true })
      return
    }
    if (action === 'append') {
      builder.appendRows(payload)
      self.postMessage({ id, result: true })
      return
    }
    if (action === 'finish') {
      const buffer = builder.toBuffer()
      builder = undefined
      self.postMessage({ id, result: buffer }, [buffer])
      return
    }
    const buffer = await buildXlsxBuffer(payload)
    // XLSX.write(type: 'array') returns a transferable ArrayBuffer
    self.postMessage({ id, result: buffer }, [buffer])
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
