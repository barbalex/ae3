import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { apiFetch } from '../../../../modules/api.js'

export const Object = ({ parentData }) => {
  const { pathname } = useLocation()

  const { data } = useQuery({
    queryKey: ['tree', 'lrObject', parentData.id],
    queryFn: () =>
      apiFetch(
        `/object?id=eq.${parentData.id}&select=id,name,children:object!parent_id(id,name,objectCount:object!parent_id(count))&children.order=name`,
      ),
    suspense: true,
  })

  if (!data) return null

  const nodes = []

  for (const node of data?.[0]?.children ?? []) {
    const count = node?.objectCount?.[0]?.count ?? 0
    const nodeData = {
      label: node.name ?? node.id,
      id: node.id,
      url: [...parentData.url, node.id],
      childrenCount: count,
      info: count,
      menuType: 'CmObject',
    }
    const isOpen = pathname.includes(node.id)

    nodes.push(
      <div key={node.id}>
        <Row data={nodeData} />
        {isOpen && !!count && (
          <Suspense fallback={<LoadingRow level={parentData.url.length + 2} />}>
            <Object parentData={nodeData} />
          </Suspense>
        )}
      </div>,
    )
  }

  return nodes
}
