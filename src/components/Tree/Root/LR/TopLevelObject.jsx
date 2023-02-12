import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router-dom'

import Row from '../../Row'
import Object from './Object'

const TopLevelObject = () => {
  const client = useApolloClient()
  const { taxId } = useParams()
  const { pathname } = useLocation()

  const { data, isLoading } = useQuery({
    queryKey: ['treeLrTopLevelObjects', taxId],
    queryFn: () => {
      return client.query({
        query: gql`
          query treeLrTopLevelObjectsQuery($taxId: UUID!) {
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
        fetchPolicy: 'no-cache',
      })
    },
  })

  // if (isLoading) return <Row data={{ label: '...' }} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allObjects?.nodes ?? []) {
    const count = node.objectsByParentId.totalCount
    const data = {
      label: node.name,
      id: node.id,
      url: ['Lebensräume', taxId, node.id],
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
