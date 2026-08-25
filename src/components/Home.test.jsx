import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import Home from './Home.jsx'

describe('Home', () => {
  it('renders the info cards', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('Informationen zu:')).toBeInTheDocument()
    expect(screen.getByText('...nachschlagen')).toBeInTheDocument()
    expect(screen.getByText('...exportieren')).toBeInTheDocument()
    expect(screen.getByText('in der Dokumentation')).toBeInTheDocument()
  })
})
