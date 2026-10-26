import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { apiFetch } from '../../../../modules/api.js'
import { Object } from './Object.jsx'

export const TopLevelObject = ({ type = 'Lebensräume' }) => {
  const { taxId } = useParams()
  const { pathname } = useLocation()

  const { data } = useQuery({
    queryKey: ['tree', 'lr', taxId],
    queryFn: () =>
      apiFetch(
        `/object?taxonomy_id=eq.${taxId}&parent_id=is.null&select=id,name,objectCount:object!object_parent_id_fkey(count)&order=name`,
      ),
    suspense: true,
  })

  if (!data) return null

  const nodes = []

  for (const node of data ?? []) {
    const count = node.objectCount?.[0]?.count ?? 0
    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: [type, taxId, node.id],
      childrenCount: count,
      info: count,
      menuType: 'CmObject',
    }
    const isOpen = pathname.includes(node.id)

    nodes.push(
      <div key={node.id}>
        <Row data={data} />
        {isOpen && !!count && (
          <Suspense fallback={<LoadingRow level={4} />}>
            <Object parentData={data} />
          </Suspense>
        )}
      </div>,
    )
  }

  return nodes
}

export default TopLevelObject
