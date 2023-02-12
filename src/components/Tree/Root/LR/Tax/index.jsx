import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import Row from '../../../Row'

const LrTax = () => {
  const client = useApolloClient()

  const { data, isLoading } = useQuery({
    queryKey: ['treeLrTaxonomies'],
    queryFn: () => {
      return client.query({
        query: gql`
          query treeLrTaxonomiesQuery {
            allTaxonomies(
              filter: { type: { equalTo: LEBENSRAUM } }
              orderBy: NAME_ASC
            ) {
              nodes {
                id
                name
                objectsByTaxonomyId(filter: { parentId: { isNull: true } }) {
                  totalCount
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
    },
  })

  if (isLoading) return <Row data={{ label: '...' }} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allTaxonomies?.nodes ?? []) {
    const count = node.objectsByTaxonomyId.totalCount
    const data = {
      label: node.name,
      id: node.id,
      url: ['Lebensräume', node.id],
      childrenCount: count,
      info: isLoading ? '...' : count,
      menuType: 'CmTaxonomy',
    }

    nodes.push(<Row key={node.id} data={data} />)
  }

  return nodes
}

export default LrTax
