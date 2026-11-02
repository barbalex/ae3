let requestId = 0

// the subset of the worker protocol these helpers rely on
type WorkerLike = {
  addEventListener(type: string, listener: (event: any) => void): void
  postMessage(message: any, transfer?: any): void
  terminate(): void
}

/**
 * One-shot rpc: spawn a worker, post { id, payload }, resolve with
 * the worker's result (or reject with its error), then terminate it.
 * A worker per call keeps the protocol trivial and leaks impossible;
 * spawn cost is small against the work the callers offload.
 */
export const runInWorker = ({
  createWorker,
  payload,
  transfer,
}: {
  createWorker: () => WorkerLike
  payload?: any
  transfer?: unknown[]
}): Promise<any> =>
  new Promise((resolve, reject) => {
    const id = ++requestId
    let worker: WorkerLike
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
}: {
  createWorker: () => WorkerLike
  columns: string[]
  pages: AsyncIterable<any[]> | Iterable<any[]>
  onChunk?: (chunk: any) => void
}): Promise<any> => {
  const worker = createWorker()
  let pending:
    | {
        id: number
        resolve: (value: any) => void
        reject: (reason?: any) => void
      }
    | undefined
  let workerError: Error | undefined

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

  const request = (action: string, payload?: any) =>
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
