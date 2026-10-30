/// <reference lib="webworker" />
import { buildCsv } from '../modules/csvWork.js'

self.onmessage = (event) => {
  const { id, payload } = event.data
  try {
    self.postMessage({ id, result: buildCsv(payload) })
  } catch (error) {
    self.postMessage({ id, error: { message: error.message } })
  }
}
