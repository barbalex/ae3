import { Chooser } from './Chooser'

type PropertiesProps = {
  properties: any[]
  relationtype: string
}

export const Properties = ({ properties, relationtype }: PropertiesProps) =>
  properties.map((p) => (
    <Chooser
      key={`${p.property ?? 'Beziehungspartner'}${p.jsontype ?? 'Boolaen'}`}
      pcname={p.pcname}
      relationtype={relationtype}
      pname={p.property ?? 'Beziehungspartner'}
      jsontype={p.jsontype ?? 'Boolean'}
      count={p.count}
      propertiesLength={properties.length}
    />
  ))
