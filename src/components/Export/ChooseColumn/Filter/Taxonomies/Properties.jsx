import { TaxField } from './TaxField/index.jsx'

export const Properties = ({ properties }) =>
  properties.map((p) => (
    <TaxField
      key={`${p.propertyName}${p.jsontype}`}
      taxname={p.taxonomyName || p.taxname}
      pname={p.propertyName}
      jsontype={p.jsontype}
    />
  ))
