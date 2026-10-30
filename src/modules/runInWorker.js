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

export const runInWorkerStream = async ({
  createWorker,
  columns,
  pages,
  onChunk,
}) => {
  const worker = createWorker()
  let pending
  let workerError

  worker.addEventListener('message', (event) => {
    const { id, result, error } = event.data ?? {}
    if (!pending || id !== pending.id) return
    const request = pending
    pending = undefined
    if (error) {
      request.reject(Object.assign(new Error(error.message), error))
    } else {
      request.resolve(result)
    }
  })
  worker.addEventListener('error', (event) => {
    workerError = new Error(event.message || 'worker failed')
    if (pending) {
      const request = pending
      pending = undefined
      request.reject(workerError)
    }
  })

  const request = (action, payload) =>
    new Promise((resolve, reject) => {
      if (workerError) {
        reject(workerError)
        return
      }
      const id = ++requestId
      pending = { id, resolve, reject }
      try {
        worker.postMessage({ id, action, payload })
      } catch (error) {
        pending = undefined
        reject(error)
      }
    })

  try {
    await request('start', columns)
    for await (const rows of pages) {
      const result = await request('append', rows)
      onChunk?.(result)
    }
    return await request('finish')
  } finally {
    worker.terminate()
  }
}
