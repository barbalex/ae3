import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { DataTable } from './DataTable.jsx'

vi.mock('simplebar-react', () => ({
  default: ({ children }) => <div>{children}</div>,
}))

vi.mock('virtua', () => ({
  VGrid: ({ rows, cols }) => (
    <div
      data-testid="virtual-grid"
      data-rows={rows.length}
      data-cols={cols.length}
    />
  ),
}))

describe('DataTable', () => {
  it('sorts a copy without mutating its input', () => {
    const data = [
      { id: 'b', Name: 'Birne' },
      { id: 'a', Name: 'Apfel' },
    ]
    const { container } = render(
      <DataTable data={data} orderBy="Name" order="asc" />,
    )

    expect(container.querySelector('tbody tr')).toHaveTextContent('Apfel')
    expect(data.map((row) => row.id)).toEqual(['b', 'a'])
  })

  it('uses the normal table for small datasets', () => {
    render(<DataTable data={[{ id: 'a', Name: 'Apfel' }]} />)

    expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'Export Vorschau')
    expect(screen.queryByTestId('virtual-grid')).not.toBeInTheDocument()
  })

  it('virtualizes datasets above the row threshold', () => {
    const data = Array.from({ length: 101 }, (_, index) => ({
      id: String(index),
      Name: `Art ${index}`,
    }))

    render(<DataTable data={data} />)

    expect(screen.getByTestId('virtual-grid')).toHaveAttribute(
      'data-rows',
      '102',
    )
    expect(screen.getByTestId('virtual-grid')).toHaveAttribute(
      'data-cols',
      '2',
    )
  })

  it('does not re-sort rows already ordered by the server', () => {
    const data = [
      { id: 'b', Name: 'Birne' },
      { id: 'a', Name: 'Apfel' },
    ]
    const { container } = render(
      <DataTable data={data} sorted orderBy="Name" order="asc" />,
    )

    expect(container.querySelector('tbody tr')).toHaveTextContent('Birne')
  })
})