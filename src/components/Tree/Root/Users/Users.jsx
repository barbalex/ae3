import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import Row from '../../Row/index.jsx'
import LoadingRow from '../../LoadingRow.jsx'

const Users = () => {
  const apolloClient = useApolloClient()

  const { data, isLoading } = useQuery({
    queryKey: ['treeUsers'],
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
        fetchPolicy: 'no-cache',
      })
    },
  })

  if (isLoading) return <LoadingRow level={2} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allUsers?.nodes ?? []) {
    const data = {
      label: node.name,
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

export default Users
