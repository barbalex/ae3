import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'

import FourOhFour from './404.jsx'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div>Startseite</div>} />
        <Route path="*" element={<FourOhFour />} />
      </Routes>
    </MemoryRouter>,
  )

describe('404', () => {
  it('shows that the page is not available', () => {
    renderAt('/gibtsnicht')
    expect(
      screen.getByText('Diese Seite ist nicht verfügbar.'),
    ).toBeInTheDocument()
  })

  it('navigates back to the start page on button click', () => {
    renderAt('/gibtsnicht')
    fireEvent.click(
      screen.getByRole('button', { name: 'Zurück zur Startseite' }),
    )
    expect(screen.getByText('Startseite')).toBeInTheDocument()
  })
})
