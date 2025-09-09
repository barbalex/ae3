import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import Row from '../../Row/index.jsx'
import LoadingRow from '../../LoadingRow.jsx'

const Organizations = () => {
  const apolloClient = useApolloClient()

  const { data, isLoading } = useQuery({
    queryKey: ['tree', 'orgs'],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return apolloClient.query({
        query: gql`
          query treeOrganizationsQuery {
            allOrganizations(orderBy: NAME_ASC) {
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

  for (const node of data?.data?.allOrganizations?.nodes ?? []) {
    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: ['Organisationen', node.id],
      childrenCount: 0,
      info: undefined,
      menuType: 'organization',
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

export default Organizations
