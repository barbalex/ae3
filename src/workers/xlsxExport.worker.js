/// <reference lib="webworker" />
import { buildXlsxBuffer } from '../modules/xlsxWork.js'

self.onmessage = async (event) => {
  const { id, payload } = event.data
  try {
    const buffer = await buildXlsxBuffer(payload)
    // no transfer list: exceljs's browser writeBuffer returns a
    // Uint8Array view, and only ArrayBuffers are transferable -
    // transferring the view throws DataCloneError. The structured
    // clone copy is cheap against building the workbook
    self.postMessage({ id, result: buffer })
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
