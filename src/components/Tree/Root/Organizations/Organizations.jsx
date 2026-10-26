import { useQuery } from '@tanstack/react-query'

import { Row } from '../../Row/index.jsx'
import { apiFetch } from '../../../../modules/api.js'

export const Organizations = () => {
  const { data } = useQuery({
    queryKey: ['tree', 'orgs'],
    queryFn: () =>
      // re-run when app focus comes back in: a tanstack-query feature
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      apiFetch('/organization?select=id,name&order=name'),
    suspense: true,
  })

  if (!data) return null

  const nodes = []

  for (const node of data ?? []) {
    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: ['Organisationen', node.id],
      childrenCount: 0,
      info: undefined,
      menuType: 'organization',
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
