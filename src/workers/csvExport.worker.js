/// <reference lib="webworker" />
import { buildCsv, buildCsvChunk } from '../modules/csvWork.js'

let fields
let includeHeader = true

self.onmessage = (event) => {
  const { id, payload, action } = event.data
  try {
    if (action === 'start') {
      fields = payload
      includeHeader = true
      self.postMessage({ id, result: true })
      return
    }
    if (action === 'append') {
      const csv = buildCsvChunk(payload, fields, includeHeader)
      includeHeader = false
      self.postMessage({ id, result: csv })
      return
    }
    if (action === 'finish') {
      fields = undefined
      includeHeader = true
      self.postMessage({ id, result: true })
      return
    }
    self.postMessage({ id, result: buildCsv(payload) })
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
