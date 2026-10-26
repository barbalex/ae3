import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/arteigenschaften/)
  await expect(page.getByText('...exportieren')).toBeVisible()
  await expect(page.getByText('in der Dokumentation')).toBeVisible()
})

test('tree loads and navigating into a taxonomy works', async ({ page }) => {
  await page.goto('/')

  // tree root rows come from graphql; data-url holds the node array
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
