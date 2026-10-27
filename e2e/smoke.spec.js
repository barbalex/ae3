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

  await expect(page.getByText('Eigenschaften', { exact: false })).toBeVisible({
    timeout: 15_000,
  })
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
