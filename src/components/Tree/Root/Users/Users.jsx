import { useQuery } from '@tanstack/react-query'

import { Row } from '../../Row/index.jsx'
import { apiFetch } from '../../../../modules/api.js'

export const Users = () => {
  const { data } = useQuery({
    queryKey: ['tree', 'users'],
    queryFn: () => apiFetch('/user?select=id,name&order=name'),
    suspense: true,
  })

  if (!data) return null

  const nodes = []

  for (const node of data ?? []) {
    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: ['Benutzer', node.id],
      childrenCount: 0,
      info: undefined,
      menuType: 'CmBenutzer',
    }

    nodes.push(
      <Row
        key={node.id}
        data={data}
      />,
    )
  }

  return nodes
}
