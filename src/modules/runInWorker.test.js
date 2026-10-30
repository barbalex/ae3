import { describe, it, expect, vi } from 'vitest'

import { runInWorker } from './runInWorker.js'

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
