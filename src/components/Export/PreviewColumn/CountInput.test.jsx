import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { CountInput } from './CountInput.jsx'

describe('CountInput', () => {
  it('applies the entered count on Enter', () => {
    const setCount = vi.fn()
    render(<CountInput count={15} setCount={setCount} />)
    const input = screen.getByRole('spinbutton')

    fireEvent.change(input, { target: { value: '120' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(setCount).toHaveBeenCalledWith(120)
  })

  it('continues applying the entered count on blur', () => {
    const setCount = vi.fn()
    render(<CountInput count={15} setCount={setCount} />)
    const input = screen.getByRole('spinbutton')

    fireEvent.change(input, { target: { value: '40' } })
    fireEvent.blur(input)

    expect(setCount).toHaveBeenCalledWith(40)
  })
})