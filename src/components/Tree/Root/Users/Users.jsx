import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { Row } from '../../Row/index.jsx'

export const Users = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['tree', 'users'],
    queryFn: () => {
      return apolloClient.query({
        query: gql`
          query treeUsersQuery {
            allUsers(orderBy: NAME_ASC) {
              nodes {
                id
                name
              }
            }
          }
        `,
      })
    },
    suspense: true,
  })

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allUsers?.nodes ?? []) {
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
