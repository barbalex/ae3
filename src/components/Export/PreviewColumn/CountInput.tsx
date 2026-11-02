import { useState } from 'react'

type CountInputProps = {
  count: number
  setCount: (count: number) => void
}

export const CountInput = ({ count, setCount }: CountInputProps) => {
  const [value, setValue] = useState(count)
  const commitCount = (input: HTMLInputElement) =>
    setCount(input.valueAsNumber)

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.valueAsNumber)}
      onBlur={(e) => commitCount(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          commitCount(e.currentTarget)
        }
      }}
      style={{ width: 70 }}
    />
  )
}
