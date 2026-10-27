import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Row } from '../../../Row/index.jsx'
import { apiFetch } from '../../../../../modules/api.js'
import { Folders } from './Folders.jsx'

export const PCs = () => {
  const { pcId } = useParams()

  const { data } = useQuery({
    queryKey: ['tree', 'pcs'],
    queryFn: () =>
      // re-run when app focus comes back in: a tanstack-query feature
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      apiFetch(
        '/property_collection?select=id,name,pcoCount:property_collection_object!property_collection_object_property_collection_id_fkey(count),relCount:relation!relation_property_collection_id_fkey(count)&order=name',
      ),
    suspense: true,
  })

  if (!data) return null

  const nodes = []

  for (const node of data ?? []) {
    const pcoCount = node.pcoCount?.[0]?.count ?? 0
    const relCount = node.relCount?.[0]?.count ?? 0

    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: ['Eigenschaften-Sammlungen', node.id],
      childrenCount: 2,
      info: pcoCount + relCount,
      menuType: 'CmPC',
    }
    const isOpen = pcId === node.id

    nodes.push(
      <div key={node.id}>
        <Row data={data} />
        {isOpen && (
          <Folders
            pc={node}
            pcoCount={pcoCount}
            relCount={relCount}
          />
        )}
      </div>,
    )
  }

  return nodes
}
