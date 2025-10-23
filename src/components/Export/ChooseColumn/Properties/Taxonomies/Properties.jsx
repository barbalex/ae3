import { Chooser } from './Taxonomy/Chooser.jsx'

export const Properties = ({ properties }) =>
  properties.map((p) => (
    <Chooser
      key={`${p.propertyName}${p.jsontype}`}
      taxname={p.taxonomyName}
      pname={p.propertyName}
      jsontype={p.jsontype}
      count={p.count}
    />
  ))
