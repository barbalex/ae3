let requestId = 0

/**
 * One-shot rpc: spawn a worker, post { id, payload }, resolve with
 * the worker's result (or reject with its error), then terminate it.
 * A worker per call keeps the protocol trivial and leaks impossible;
 * spawn cost is small against the work the callers offload.
 */
export const runInWorker = ({ createWorker, payload, transfer }) =>
  new Promise((resolve, reject) => {
    const id = ++requestId
    let worker
    try {
      worker = createWorker()
    } catch (error) {
      reject(error)
      return
    }
    worker.addEventListener('message', (event) => {
      const { id: responseId, result, error } = event.data ?? {}
      if (responseId !== id) return
      worker.terminate()
      if (error) {
        reject(Object.assign(new Error(error.message), error))
      } else {
        resolve(result)
      }
    })
    worker.addEventListener('error', (event) => {
      worker.terminate()
      reject(new Error(event.message || 'worker failed'))
    })
    worker.postMessage({ id, payload }, transfer ?? [])
  })
