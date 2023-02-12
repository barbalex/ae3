import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

import Row from '../../Row'

const Object = ({ parentData }) => {
  const client = useApolloClient()
  const { pathname } = useLocation()

  const { data, isLoading } = useQuery({
    queryKey: ['treeLrObject', parentData.id],
    queryFn: () => {
      return client.query({
        query: gql`
          query treeLrObjectQuery($parentId: UUID!) {
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

  // if (isLoading) return <Row data={{ label: '...' }} />

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
      <>
        <Row data={nodeData} />
        {isOpen && !!count && <Object parentData={nodeData} />}
      </>,
    )
  }

  return nodes
}

export default Object
