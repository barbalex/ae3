import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { gql } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Data } from './index.jsx'
import Home from '../Home.jsx'
import { treeQuery } from '../Tree/treeQuery.js'

// same query as in Tree/Root/index.jsx, which does not export it
const treeRootQuery = gql`
  query treeRootQuery($hasToken: Boolean!) {
    arten: allTaxonomies(filter: { type: { equalTo: ART } }) {
      totalCount
    }
    lebensraeume: allTaxonomies(
      filter: { type: { equalTo: LEBENSRAUM } }
    ) {
      totalCount
    }
    allPropertyCollections {
      totalCount
    }
    allUsers @include(if: $hasToken) {
      totalCount
    }
    allOrganizations @include(if: $hasToken) {
      totalCount
    }
  }
`

const mocks = [
  {
    request: { query: treeQuery, variables: { username: '' } },
    result: { data: { userByName: null } },
  },
  {
    request: { query: treeRootQuery, variables: { hasToken: false } },
    result: {
      data: {
        arten: { totalCount: 3 },
        lebensraeume: { totalCount: 2 },
        allPropertyCollections: { totalCount: 1 },
      },
    },
  },
]

describe('Data', () => {
  it('renders the tree root and the home page', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<Data />}>
                <Route index element={<Home />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
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
  })
})
