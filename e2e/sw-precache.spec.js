import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { spawn } from 'node:child_process'

// guards the vite-plugin-pwa config in vite.config.js: the ~1.3 MB
// exceljs/xlsx chunks must not be precached (they are lazily imported
// on first export/import) but runtime-cache after first use, so
// repeated offline exports keep working.
// serves the built app itself on its own port, separate from the
// dev server the other specs use
const port = 4199
const base = `http://localhost:${port}`
let previewProc = null

const responding = async () => {
  try {
    return (await fetch(base, { signal: AbortSignal.timeout(1000) })).ok
  } catch {
    return false
  }
}

test.beforeAll(async () => {
  // rebuild when there is no build or the pwa config changed after it
  if (
    !existsSync('dist/sw.js') ||
    statSync('vite.config.js').mtimeMs > statSync('dist/sw.js').mtimeMs
  ) {
    await new Promise((resolve, reject) => {
      const build = spawn('npm', ['run', 'build'], { stdio: 'ignore' })
      build.on('exit', (code) =>
        code === 0 ? resolve() : reject(new Error('npm run build failed')),
      )
    })
  }
  if (await responding()) return
  previewProc = spawn(
    'npx',
    ['vite', 'preview', '--port', String(port), '--strictPort'],
    { stdio: 'ignore', detached: true },
  )
  for (let i = 0; i < 100; i++) {
    if (await responding()) return
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('vite preview did not come up')
})

test.afterAll(async () => {
  if (previewProc) {
    try {
      process.kill(-previewProc.pid)
    } catch {
      // already gone
    }
  }
})

test('excel chunks are not precached but runtime-cache on first fetch', async ({
  browser,
}) => {
  const ctx = await browser.newContext({ baseURL: base })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)

  // the precache must not contain the excel chunks
  const precacheUrls = await page.evaluate(async () => {
    const names = await caches.keys()
    const precache = names.find((n) => n.includes('precache'))
    const cache = await caches.open(precache)
    return (await cache.keys()).map((r) => r.url)
  })
  const excelChunks = readdirSync('dist/assets').filter((f) =>
    /^(xlsx-|exceljs\.min-).*\.js$/.test(f),
  )
  // the excel libraries are lazily imported, so chunks must exist
  // (since cee3c53 there may be several xlsx- chunks and no exceljs)
  expect(excelChunks.length).toBeGreaterThan(0)
  expect(
    precacheUrls.filter((u) => excelChunks.some((c) => u.includes(c))),
  ).toEqual([])

  // fetching them through the service worker returns 200 and populates
  // the runtime cache (workbox writes the entry asynchronously)
  for (const chunk of excelChunks) {
    const status = await page.evaluate(
      async (c) => (await fetch(`assets/${c}`)).status,
      chunk,
    )
    expect(status).toBe(200)
  }
  const runtimeUrls = await page.evaluate(async (chunks) => {
    const wanted = chunks.map((c) => new URL(`assets/${c}`, location.origin).href)
    for (let i = 0; i < 50; i++) {
      const cache = await caches.open('excel-chunks')
      const keys = (await cache.keys()).map((r) => r.url)
      if (wanted.every((u) => keys.includes(u))) return keys
      await new Promise((r) => setTimeout(r, 100))
    }
    const cache = await caches.open('excel-chunks')
    return (await cache.keys()).map((r) => r.url)
  }, excelChunks)
  for (const chunk of excelChunks) {
    expect(runtimeUrls).toContain(`${base}/assets/${chunk}`)
  }

  expect(errors).toEqual([])
})
