import { test, expect } from '@playwright/test'

const iconOf = (page, url) =>
  page.locator(`[data-url="${url}"] > div:nth-child(2) svg`)

test('home page renders', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/arteigenschaften/)
  await expect(page.getByText('...exportieren')).toBeVisible()
  await expect(page.getByText('in der Dokumentation')).toBeVisible()
})

test('tree loads and navigating into a taxonomy works', async ({ page }) => {
  await page.goto('/')

  // tree root rows come from postgrest; data-url holds the node array
  const artenRow = page.locator('[data-url="Arten"]')
  await expect(artenRow).toBeVisible({ timeout: 15_000 })

  await artenRow.click()
  await expect(page).toHaveURL(/\/Arten$/)

  // level 2: taxonomy rows
  const taxonomyRow = page.locator('[data-url^="Arten,"]').first()
  await expect(taxonomyRow).toBeVisible({ timeout: 15_000 })

  await taxonomyRow.click()
  await expect(page).toHaveURL(/\/Arten\/[^/]+$/, { timeout: 15_000 })

  // level 3: top level objects of the taxonomy load.
  // this catches failing list queries: their errors are swallowed by
  // the error boundary, so only asserting rendered rows proves them
  const taxonomyUrl = await taxonomyRow.getAttribute('data-url')
  const objectRow = page.locator(`[data-url^="${taxonomyUrl},"]`).first()
  await expect(objectRow).toBeVisible({ timeout: 15_000 })

  // clicking an object must not rebuild the tree from blank:
  // if any ancestor suspends unscoped, this handle gets disconnected
  const artenHandle = await artenRow.elementHandle()

  await objectRow.click()
  await expect(page).toHaveURL(/\/Arten\/[^/]+\/[^/]+$/, {
    timeout: 15_000,
  })
  expect(await artenHandle.evaluate((el) => el.isConnected)).toBe(true)
})

test('object page loads its property collections', async ({ page }) => {
  // this object has property collections (e.g. ZH GIS), unlike the
  // first object of CSCF (2009) used above - pins the pcs queries
  await page.goto(
    '/Arten/c87f19f2-1b77-11ea-8282-bbc40e20aff6/c3d82f63-1c13-11ea-8282-6b46a89d266c/c3d82f64-1c13-11ea-8282-07e5a9d2fa66',
  )

  // 'ZH GIS' is the real content assertion. A former substring
  // assertion on 'Eigenschaften' matched the site title
  // 'Arteigenschaften' (and the tree's 'Eigenschaften-Sammlungen'
  // row), so it asserted nothing and raced the tree render
  await expect(page.getByText('ZH GIS', { exact: true })).toBeVisible({
    timeout: 15_000,
  })
})

test('open icon closes the node even with a lower level active', async ({
  page,
}) => {
  await page.goto('/')

  // open Arten, first taxonomy, first object
  await page.locator('[data-url="Arten"]').click()
  await page.waitForURL(/\/Arten$/)
  const taxUrl = await page
    .locator('[data-url^="Arten,"]')
    .first()
    .getAttribute('data-url')
  await page.locator(`[data-url="${taxUrl}"]`).first().click()
  await page.waitForURL(/\/Arten\/[^/]+$/)
  const objUrl = await page
    .locator(`[data-url^="${taxUrl},"]`)
    .first()
    .getAttribute('data-url')
  await page.locator(`[data-url="${objUrl}"]`).first().click()
  await page.waitForURL(/\/Arten\/[^/]+\/[^/]+$/)

  // clicking the OPEN icon of the taxonomy while the object below is active:
  // the taxonomy must close and its parent (Arten) become active
  await iconOf(page, taxUrl).click()
  await page.waitForURL(/\/Arten$/)
  await expect(page.locator(`[data-url="${objUrl}"]`).first()).toBeHidden()
})

test('clicking a row text activates the element and closes deeper levels', async ({
  page,
}) => {
  await page.goto('/')

  await page.locator('[data-url="Arten"]').click()
  await page.waitForURL(/\/Arten$/)
  const taxUrl = await page
    .locator('[data-url^="Arten,"]')
    .first()
    .getAttribute('data-url')
  await page.locator(`[data-url="${taxUrl}"]`).first().click()
  await page.waitForURL(/\/Arten\/[^/]+$/)
  const objUrl = await page
    .locator(`[data-url^="${taxUrl},"]`)
    .first()
    .getAttribute('data-url')
  await page.locator(`[data-url="${objUrl}"]`).first().click()
  await page.waitForURL(/\/Arten\/[^/]+\/[^/]+$/)
  // the object's children are listed
  await expect(
    page.locator(`[data-url^="${objUrl},"]`).first(),
  ).toBeVisible({ timeout: 15_000 })

  // clicking the taxonomy row's TEXT: it becomes active,
  // the object stays visible, the object's children close
  await page.locator(`[data-url="${taxUrl}"] > div:nth-child(3)`).click()
  await page.waitForURL(new RegExp(`/Arten/[^/]+$`))
  await expect(page.locator(`[data-url="${objUrl}"]`).first()).toBeVisible()
  await expect(page.locator(`[data-url^="${objUrl},"]`).first()).toBeHidden()
})

test('theme chooser cycles light/dark/system and persists', async ({ page }) => {
  await page.goto('/')
  // pre-paint script sets the attribute before the app renders
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  const chooser = page.getByRole('button', { name: 'Darstellung: wie System' })

  // system > light > dark
  await chooser.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(
    page.getByRole('button', { name: 'Darstellung: hell' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Darstellung: hell' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(
    page.getByRole('button', { name: 'Darstellung: dunkel' }),
  ).toBeVisible()

  // the choice survives a reload (localStorage + pre-paint script)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  // dark mode paints the page background dark
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  )
  expect(bg).toBe('rgb(18, 18, 18)')

  // back to system for other tests
  await page.getByRole('button', { name: 'Darstellung: dunkel' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('filter search navigates to the deep object url in one rpc', async ({
  page,
}) => {
  const objectPathRequests = []
  page.on('request', (r) => {
    if (r.url().includes('object_path')) objectPathRequests.push(r.url())
    // the former implementation fetched parents one per level with
    // exactly this select; page loads legitimately fetch objects
    // with parentId among other fields
    if (
      r.url().includes('object?id=eq.') &&
      r.url().includes('select=id,parentId:parent_id&limit=1')
    )
      objectPathRequests.push(`LEGACY-PARENT-FETCH ${r.url().slice(0, 80)}`)
  })

  await page.goto('/')

  const search = page.getByRole('combobox', { name: 'treeFilter' })
  await search.click()
  await search.fill('Pulsatilla vulgaris')

  // the debounced (600ms) search offers the object and its child;
  // the child has a real ancestor chain to walk
  const option = page.getByRole('option', {
    name: 'DB-TAXREF (2017): Pulsatilla vulgaris Mill. subsp. vulgaris',
    exact: true,
  })
  await expect(option).toBeVisible({ timeout: 10_000 })
  await option.click()

  // navigation to the deep url happens through the parent chain
  await expect(page).toHaveURL(
    /\/Arten\/[^/]+\/c3d82f63-1c13-11ea-8282-6b46a89d266c\/c3d82f64-1c13-11ea-8282-07e5a9d2fa66/,
    { timeout: 30_000 },
  )

  // the tree shows and scrolled to the active object row
  await expect(
    page.locator(
      '[data-url$="c3d82f64-1c13-11ea-8282-07e5a9d2fa66"]',
    ),
  ).toBeVisible({ timeout: 15_000 })

  // the path was built with the rpc only (2 calls are normal in dev:
  // StrictMode remounts refetch) - and none of the former per-level
  // parent fetches ran
  const rpcCalls = objectPathRequests.filter((u) => u.includes('object_path'))
  expect(rpcCalls.length).toBeGreaterThan(0)
  expect(rpcCalls.length).toBeLessThanOrEqual(2)
  expect(
    objectPathRequests.filter((u) => u.startsWith('LEGACY-PARENT-FETCH')),
  ).toEqual([])
})

test('xlsx export downloads a real workbook', async ({ page }) => {
  // guards the worker-based export: a broken worker used to save a
  // 9-byte file containing the string "undefined"
  const { readFile } = await import('node:fs/promises')

  await page.goto(
    '/Eigenschaften-Sammlungen/bdf7f7e8-7b0e-11e8-a16e-833996057b4d/Eigenschaften',
  )
  await expect(
    page.getByRole('button', { name: 'xlsx exportieren' }),
  ).toBeVisible({ timeout: 15_000 })

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'xlsx exportieren' }).click()
  const download = await downloadPromise

  const bytes = await readFile(await download.path())
  // xlsx files are zips (PK magic) with real size
  expect(bytes[0]).toBe(0x50)
  expect(bytes[1]).toBe(0x4b)
  expect(bytes.length).toBeGreaterThan(1000)
})

test('rco xlsx export pages through the full collection', async ({ page }) => {
  const { readFile } = await import('node:fs/promises')
  const { read, utils } = await import('@e965/xlsx')
  const collectionId = 'bdf5c7c1-7b0e-11e8-b9a5-bd4f79edbcc4'
  const exportOffsets = []

  page.on('request', (request) => {
    const url = new URL(request.url())
    if (
      url.pathname.endsWith('/relation') &&
      url.searchParams.get('property_collection_id') === `eq.${collectionId}` &&
      url.searchParams.get('limit') === '500'
    ) {
      exportOffsets.push(url.searchParams.get('offset'))
    }
  })

  await page.goto(
    `/Eigenschaften-Sammlungen/${collectionId}/Beziehungen`,
  )
  await expect(
    page.getByRole('button', { name: 'xlsx exportieren' }),
  ).toBeVisible({ timeout: 15_000 })

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'xlsx exportieren' }).click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())
  const workbook = read(bytes, { type: 'buffer' })
  const rows = utils.sheet_to_json(workbook.Sheets.Daten, { header: 1 })

  expect(rows).toHaveLength(1547)

  const csvDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'csv exportieren' }).click()
  const csvDownload = await csvDownloadPromise
  const csvBytes = await readFile(await csvDownload.path())
  const csvWorkbook = read(csvBytes, { type: 'buffer' })
  const csvRows = utils.sheet_to_json(csvWorkbook.Sheets.Sheet1, { header: 1 })

  expect(exportOffsets).toEqual([
    '0', '500', '1000', '1500',
    '0', '500', '1000', '1500',
  ])
  expect(csvRows).toHaveLength(1547)
})

test('large collection previews virtualize table rows', async ({ page }) => {
  const collectionId = 'bdf4b650-7b0e-11e8-b9a5-bd4f79edbcc4'
  await page.goto(
    `/Eigenschaften-Sammlungen/${collectionId}/Eigenschaften`,
  )

  const countInput = page.locator('input[type="number"]')
  await expect(countInput).toBeVisible({ timeout: 15_000 })
  await countInput.fill('120')
  await countInput.blur()

  const table = page.getByRole('table', { name: 'Export Vorschau' })
  await expect(table).toHaveAttribute('aria-rowcount', '121')
  await expect
    .poll(() => table.getByRole('row').count())
    .toBeLessThan(121)
  const tableBox = await table.boundingBox()
  const viewport = page.viewportSize()
  expect(tableBox.height).toBeGreaterThan(viewport.height * 0.7)
})

test('large relation previews apply Enter and fill the available height', async ({ page }) => {
  const collectionId = 'bdf5c7c1-7b0e-11e8-b9a5-bd4f79edbcc4'
  await page.goto(
    `/Eigenschaften-Sammlungen/${collectionId}/Beziehungen`,
  )

  const countInput = page.locator('input[type="number"]')
  await expect(countInput).toBeVisible({ timeout: 15_000 })
  await countInput.fill('120')
  await countInput.press('Enter')

  const table = page.getByRole('table', { name: 'Export Vorschau' })
  await expect(table).toHaveAttribute('aria-rowcount', '121')
  await expect
    .poll(() => table.getByRole('row').count())
    .toBeLessThan(121)
  const tableBox = await table.boundingBox()
  const viewport = page.viewportSize()
  expect(tableBox.height).toBeGreaterThan(viewport.height * 0.7)
})
