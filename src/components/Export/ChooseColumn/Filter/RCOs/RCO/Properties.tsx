import { useQueryClient } from '@tanstack/react-query'

import { Property } from './Property'

type PropertiesProps = {
  properties: any[]
}

export const Properties = ({ properties }: PropertiesProps) => {
  const queryClient = useQueryClient()

  return properties.map((p) => (
    <Property
      key={`${p.propertyName}|${p.relationType}|${p.jsontype}`}
      pcname={p.propertyCollectionName}
      relationtype={p.relationType}
      pname={p.propertyName}
      jsontype={p.jsontype}
    />
  ))
}
