import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { apiFetch } from '../../../../modules/api.js'
import { TopLevelObject } from './TopLevelObject.jsx'

export const Tax = ({ type = 'Lebensräume' }) => {
  const { taxId } = useParams()

  const { data } = useQuery({
    queryKey: ['tree', 'lrTax', type],
    queryFn: () =>
      apiFetch(
        `/taxonomy?select=id,name,objectCount:object(count)&type=eq.${
          type === 'Lebensräume' ? 'Lebensraum' : 'Art'
        }&object.parent_id=is.null&order=name`,
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
      url: [type, node.id],
      childrenCount: count,
      info: count,
      menuType: 'CmTaxonomy',
    }
    const isOpen = taxId === node.id

    nodes.push(
      <div key={node.id}>
        <Row data={data} />
        {isOpen && (
          <Suspense fallback={<LoadingRow level={3} />}>
            <TopLevelObject type={type} />
          </Suspense>
        )}
      </div>,
    )
  }

  return nodes
}
