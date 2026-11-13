import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { version as appVersion } from '../../../package.json'
import { VersionCheck } from './index'

// the component fetches /version.json with cache: 'no-store'; stub
// the global and vary the payload per test
const fetchMock = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchMock)

const respondWith = (version: string) =>
  fetchMock.mockImplementation(async () => {
    return { ok: true, json: async () => ({ version }) } as Response
  })

// flush the microtask queue so a settled fetch comparison has run
const flush = () => new Promise((resolve) => setTimeout(resolve, 20))

describe('VersionCheck', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    localStorage.clear()
  })

  it('shows the banner when the deployed version differs', async () => {
    respondWith('999.0.0')
    render(<VersionCheck />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      `Eine neue Version (999.0.0) von arteigenschaften ist verfügbar. Die laufende Version (${appVersion}) ist veraltet und kann Fehler verursachen.`,
    )
    expect(
      screen.getByRole('button', { name: 'App aktualisieren' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'später' })).toBeInTheDocument()
  })

  it('shows nothing while the versions match', async () => {
    respondWith(appVersion)
    const { container } = render(<VersionCheck />)

    await flush()

    expect(container.innerHTML).toBe('')
  })

  it('shows nothing when /version.json is unavailable (dev server, offline)', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('not found')
    })
    const { container } = render(<VersionCheck />)

    await flush()

    expect(container.innerHTML).toBe('')
  })

  it('hides the banner until the next version when "später" is clicked', async () => {
    respondWith('999.0.0')
    render(<VersionCheck />)

    fireEvent.click(await screen.findByRole('button', { name: 'später' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    // the dismissal is bound to the running version
    expect(localStorage.getItem('versionCheckDismissedVersion')).toBe(
      appVersion,
    )
  })
})
