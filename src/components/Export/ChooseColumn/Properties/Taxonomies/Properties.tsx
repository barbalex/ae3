import { Chooser } from './Taxonomy/Chooser'

type PropertiesProps = {
  properties: any[]
}

export const Properties = ({ properties }: PropertiesProps) =>
  properties.map((p) => (
    <Chooser
      key={`${p.propertyName}${p.jsontype}`}
      taxname={p.taxonomyName}
      pname={p.propertyName}
      jsontype={p.jsontype}
      count={p.count}
    />
  ))
