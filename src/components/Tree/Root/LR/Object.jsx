import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router'

import Row from '../../Row/index.jsx'
import LoadingRow from '../../LoadingRow.jsx'

const Object = ({ parentData }) => {
  const client = useApolloClient()
  const { pathname } = useLocation()

  const { data, isLoading } = useQuery({
    queryKey: ['treeObject', parentData.id],
    queryFn: () => {
      return client.query({
        query: gql`
          query treeObjectQuery($parentId: UUID!) {
            objectById(id: $parentId) {
              id
              name
              objectsByParentId(orderBy: NAME_ASC) {
                totalCount
                nodes {
                  id
                  name
                  objectsByParentId {
                    totalCount
                  }
                }
              }
            }
          }
        `,
        variables: { parentId: parentData.id },
        fetchPolicy: 'no-cache',
      })
    },
  })

  if (isLoading) return <LoadingRow level={parentData.url.length + 1} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.objectById?.objectsByParentId?.nodes ?? []) {
    const count = node?.objectsByParentId?.totalCount
    const nodeData = {
      label: node.name,
      id: node.id,
      url: [...parentData.url, node.id],
      childrenCount: count,
      info: isLoading ? '...' : count,
      menuType: 'CmObject',
    }
    const isOpen = pathname.includes(node.id)

    nodes.push(
      <div key={node.id}>
        <Row data={nodeData} />
        {isOpen && !!count && <Object parentData={nodeData} />}
      </div>,
    )
  }

  return nodes
}

export default Object
