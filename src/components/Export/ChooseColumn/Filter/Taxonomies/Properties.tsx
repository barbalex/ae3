import { TaxField } from './TaxField'

type PropertiesProps = {
  properties: any[]
}

export const Properties = ({ properties }: PropertiesProps) =>
  properties.map((p) => (
    <TaxField
      key={`${p.propertyName}${p.jsontype}`}
      taxname={p.taxonomyName || p.taxname}
      pname={p.propertyName}
      jsontype={p.jsontype}
    />
  ))
