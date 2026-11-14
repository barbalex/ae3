import { test, expect } from '@playwright/test'

import type { Page } from '@playwright/test'

// role tests: login via ae.login and the taxonomy-writer gating of the
// tree context menu. Uses the dev-only seeded users from
// backend-dev/db/init/05_test_users.sql (see CLAUDE.md "Testing user
// roles"). Requires the local backend (cd backend-dev && docker compose up)
// with the seed applied.

const TEST_PASS = 'ae3-test-pass'

const login = async (page: Page, username: string) => {
  await page.goto('/Login')
  await page.getByLabel('Name').fill(username)
  // blurring the name field stores it in state; the login fires on blur
  // of the pass field once both fields are set
  await page.getByLabel('Name').blur()
  // the pass input's label association is broken (InputLabel points to
  // the nonexistent id "password"), so target the input by its real id
  await page.locator('#adornment-password').fill(TEST_PASS)
  await page.locator('#adornment-password').blur()

  // the abmelden button renders as soon as the token is set
  await expect(
    page.getByRole('button', { name: 'abmelden' }),
  ).toBeVisible()
  // fetchLogin navigates home after 2s
  await page.waitForURL('/', { timeout: 15_000 })
}

// opens Arten and right-clicks the first taxonomy row, whose menu
// (CmTaxonomy) is taxWriterOnly. The userRole response is awaited so the
// menu gating has settled before the click.
const rightClickFirstTaxonomy = async (page: Page) => {
  const userRoleLoaded = page.waitForResponse((r) =>
    r.url().includes('/user?select=id,organizationUsers'),
  )
  await page.goto('/')
  await userRoleLoaded

  await page.locator('[data-url="Arten"]').click()
  await page.waitForURL(/\/Arten$/)
  const taxRow = page.locator('[data-url^="Arten,"]').first()
  await expect(taxRow).toBeVisible({ timeout: 15_000 })
  await taxRow.click({ button: 'right' })
}

test('taxonomy writer logs in and gets the writer context menu', async ({
  page,
}) => {
  await login(page, 'test-taxonomy-writer')
  await rightClickFirstTaxonomy(page)

  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('menuitem').first()).toHaveText(
    'erstelle neues Objekt (eine Ebene tiefer)',
  )
})

test('collection writer logs in but gets no taxonomy writer menu', async ({
  page,
}) => {
  await login(page, 'test-collection-writer')
  await rightClickFirstTaxonomy(page)

  // orgCollectionWriter is no taxonomy writer: the taxWriterOnly menu
  // must not render at all
  await expect(page.getByRole('menu')).toHaveCount(0)
})

test('anonymous users get no writer context menu', async ({ page }) => {
  await rightClickFirstTaxonomy(page)

  await expect(page.getByRole('menu')).toHaveCount(0)
})
