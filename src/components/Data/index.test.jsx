import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { apiFetch, apiCount } from '../../modules/api.js'
import { Data } from './index.jsx'
import Home from '../Home.jsx'

// mock the PostgREST api module: the tree asks for the logged-in
// user's roles, the root for counts of taxonomies/pcs
vi.mock('../../modules/api.js', () => ({
  apiFetch: vi.fn(async (path) => {
    if (path.startsWith('/user?')) return []
    throw new Error(`unmocked apiFetch: ${path}`)
  }),
  apiCount: vi.fn(async (path) => {
    if (path.startsWith('/taxonomy?type=eq.Art')) return 3
    if (path.startsWith('/taxonomy?type=eq.Lebensraum')) return 2
    if (path.startsWith('/property_collection')) return 1
    if (path.startsWith('/user')) return 0
    if (path.startsWith('/organization')) return 0
    throw new Error(`unmocked apiCount: ${path}`)
  }),
  rpc: vi.fn(),
}))

// jsdom has no layout, so the real VList measures a zero viewport and
// renders no rows; render all children instead. Real virtualization
// is covered by the e2e tests
vi.mock('virtua', () => ({
  VList: ({ children }) => <div>{children}</div>,
}))

describe('Data', () => {
  it('renders the tree root and the home page', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Data />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    // tree root rows load with their counts
    expect(await screen.findByText('Arten')).toBeInTheDocument()
    expect(screen.getByText('(3 Taxonomien)')).toBeInTheDocument()
    expect(screen.getByText('Lebensräume')).toBeInTheDocument()
    expect(screen.getByText('(2 Taxonomien)')).toBeInTheDocument()
    expect(
      screen.getByText('Eigenschaften-Sammlungen'),
    ).toBeInTheDocument()

    // the routed home page shows in the outlet
    expect(screen.getByText('...exportieren')).toBeInTheDocument()

    expect(apiFetch).toHaveBeenCalled()
    expect(apiCount).toHaveBeenCalled()
  })
})
