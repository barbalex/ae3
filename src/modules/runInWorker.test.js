import { describe, it, expect, vi } from 'vitest'

import { runInWorker, runInWorkerStream } from './runInWorker.js'

class FakeWorker {
  constructor() {
    this.listeners = {}
    this.terminated = false
  }
  addEventListener(type, fn) {
    this.listeners[type] = fn
  }
  postMessage(message, transfer) {
    this.posted = { message, transfer }
  }
  emit(data) {
    this.listeners.message({ data })
  }
  fail(message) {
    this.listeners.error({ message })
  }
  terminate() {
    this.terminated = true
  }
}

describe('runInWorker', () => {
  it('posts the payload and resolves with the result, then terminates', async () => {
    const worker = new FakeWorker()
    const promise = runInWorker({
      createWorker: () => worker,
      payload: { rows: [1, 2] },
      transfer: ['transferable'],
    })

    expect(worker.posted.message.payload).toEqual({ rows: [1, 2] })
    expect(worker.posted.transfer).toEqual(['transferable'])

    worker.emit({ id: worker.posted.message.id, result: 'done' })
    await expect(promise).resolves.toBe('done')
    expect(worker.terminated).toBe(true)
  })

  it('ignores messages with a foreign id', async () => {
    const worker = new FakeWorker()
    const promise = runInWorker({ createWorker: () => worker, payload: null })

    worker.emit({ id: 9999, result: 'not mine' })
    worker.emit({ id: worker.posted.message.id, result: 'mine' })

    await expect(promise).resolves.toBe('mine')
  })

  it('rejects with the error the worker reported', async () => {
    const worker = new FakeWorker()
    const promise = runInWorker({ createWorker: () => worker, payload: null })

    worker.emit({
      id: worker.posted.message.id,
      error: { message: 'boom', code: 'X' },
    })

    await expect(promise).rejects.toMatchObject({
      message: 'boom',
      code: 'X',
    })
    expect(worker.terminated).toBe(true)
  })

  it('rejects when the worker errors', async () => {
    const worker = new FakeWorker()
    const promise = runInWorker({ createWorker: () => worker, payload: null })

    worker.fail('syntax error in worker')

    await expect(promise).rejects.toThrow('syntax error in worker')
    expect(worker.terminated).toBe(true)
  })

  it('rejects when the worker cannot be created', async () => {
    const createWorker = vi.fn(() => {
      throw new Error('no workers here')
    })

    await expect(
      runInWorker({ createWorker, payload: null }),
    ).rejects.toThrow('no workers here')
  })
})

describe('runInWorkerStream', () => {
  it('sends one page at a time and returns the final result', async () => {
    const worker = new FakeWorker()
    worker.postedMessages = []
    worker.postMessage = (message) => {
      worker.postedMessages.push(message)
      queueMicrotask(() =>
        worker.emit({
          id: message.id,
          result:
            message.action === 'append' ? message.payload.length
            : message.action === 'finish' ? 'done'
            : true,
        }),
      )
    }
    const onChunk = vi.fn()
    const pages = (async function* () {
      yield [{ id: 1 }]
      yield [{ id: 2 }, { id: 3 }]
    })()

    await expect(
      runInWorkerStream({
        createWorker: () => worker,
        columns: ['id'],
        pages,
        onChunk,
      }),
    ).resolves.toBe('done')

    expect(worker.postedMessages.map(({ action }) => action)).toEqual([
      'start',
      'append',
      'append',
      'finish',
    ])
    expect(onChunk.mock.calls).toEqual([[1], [2]])
    expect(worker.terminated).toBe(true)
  })

  it('terminates and rejects when the worker reports an error', async () => {
    const worker = new FakeWorker()
    worker.postMessage = (message) =>
      queueMicrotask(() =>
        worker.emit({ id: message.id, error: { message: 'stream failed' } }),
      )

    await expect(
      runInWorkerStream({
        createWorker: () => worker,
        columns: [],
        pages: [],
      }),
    ).rejects.toThrow('stream failed')
    expect(worker.terminated).toBe(true)
  })

  it('rejects if the worker fails between page acknowledgements', async () => {
    const worker = new FakeWorker()
    worker.postMessage = (message) => {
      queueMicrotask(() => {
        worker.emit({ id: message.id, result: true })
        worker.fail('worker stopped')
      })
    }
    const pages = (async function* () {
      yield [{ id: 1 }]
    })()

    await expect(
      runInWorkerStream({
        createWorker: () => worker,
        columns: ['id'],
        pages,
      }),
    ).rejects.toThrow('worker stopped')
    expect(worker.terminated).toBe(true)
  })
})
