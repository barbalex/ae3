import { Chooser } from './Chooser.jsx'

export const Properties = ({ properties, pcName }) =>
  properties.map((p) => (
    <Chooser
      key={`${p.property}${p.type}`}
      pcname={pcName}
      pname={p.property}
      jsontype={p.type}
    />
  ))
