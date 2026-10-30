import { useState } from 'react'

export const CountInput = ({ count, setCount }) => {
  const [value, setValue] = useState(count)
  const commitCount = (input) => setCount(input.valueAsNumber)

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
