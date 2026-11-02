import { Chooser } from './Chooser'

type PropertiesProps = {
  properties: any[]
  pcName: string
}

export const Properties = ({ properties, pcName }: PropertiesProps) =>
  properties.map((p) => (
    <Chooser
      key={`${p.property}${p.type}`}
      pcname={pcName}
      pname={p.property}
      jsontype={p.type}
    />
  ))
