import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { Object } from './Object.jsx'

export const TopLevelObject = ({ type = 'Lebensräume' }) => {
  const apolloClient = useApolloClient()
  const { taxId } = useParams()
  const { pathname } = useLocation()

  const { data, isLoading } = useQuery({
    queryKey: ['tree', 'lr', taxId],
    queryFn: () => {
      return apolloClient.query({
        query: gql`
          query treeTopLevelObjectsQuery($taxId: UUID!) {
            allObjects(
              filter: {
                taxonomyId: { equalTo: $taxId }
                parentId: { isNull: true }
              }
              orderBy: NAME_ASC
            ) {
              nodes {
                id
                name
                objectsByParentId {
                  totalCount
                }
              }
            }
          }
        `,
        variables: { taxId },
      })
    },
  })

  if (isLoading) return <LoadingRow level={3} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allObjects?.nodes ?? []) {
    const count = node.objectsByParentId.totalCount
    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: [type, taxId, node.id],
      childrenCount: count,
      info: isLoading ? '...' : count,
      menuType: 'CmObject',
    }
    const isOpen = pathname.includes(node.id)

    nodes.push(
      <div key={node.id}>
        <Row data={data} />
        {isOpen && !!count && <Object parentData={data} />}
      </div>,
    )
  }

  return nodes
}

export default TopLevelObject
