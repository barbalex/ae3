import { test, expect } from '@playwright/test'
import { createHmac } from 'node:crypto'

// TEMPORARY verification spec - not committed
const mintToken = () => {
  const b64url = (buf) =>
    Buffer.from(buf).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  const header = b64url(JSON.stringify({ typ: 'JWT', alg: 'HS256' }))
  const payload = b64url(JSON.stringify({ role: 'org_admin', username: 'Alexander Gabriel', exp: Math.floor(Date.now() / 1000) + 3600 }))
  const sig = b64url(createHmac('sha256', process.env.AE_JWT_SECRET).update(`${header}.${payload}`).digest())
  return `${header}.${payload}.${sig}`
}

test('pc form shows edit button and organization options for writers', async ({ page }) => {
  await page.addInitScript(
    ([token]) => {
      window.localStorage.setItem('ae-login-token', JSON.stringify(token))
      window.localStorage.setItem('ae-login-username', JSON.stringify('Alexander Gabriel'))
    },
    [mintToken()],
  )
  // a pc of the org this user administers
  await page.goto(
    '/Eigenschaften-Sammlungen/bdf7f7e8-7b0e-11e8-a16e-833996057b4d',
  )

  // read view shows the org; the edit button appears for writers
  await expect(page.getByText('Zuständige Organisation')).toBeVisible({ timeout: 15_000 })
  const editButton = page.getByRole('button', { name: 'Daten bearbeiten' })
  await expect(editButton).toBeVisible({ timeout: 10_000 })

  // the form offers the user's writer organizations
  await editButton.click()
  // MUI Select: the clickable surface is the .MuiSelect-select div,
  // not the hidden input
  const orgSelect = page.locator('.MuiSelect-select').filter({
    hasText: 'a8e5bc98',
  })
  await expect(orgSelect).toBeVisible()
  await orgSelect.click()
  await expect(page.getByRole('option', { name: 'FNS Kt. ZH' })).toBeVisible({
    timeout: 5_000,
  })
})
