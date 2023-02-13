import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Row from '../../Row'
import LoadingRow from '../../LoadingRow'
import TopLevelObject from './TopLevelObject'

const Tax = ({ type = 'Lebensräume' }) => {
  const client = useApolloClient()
  const { taxId } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['treeTaxonomies', type],
    queryFn: () => {
      return client.query({
        query: gql`
          query treeTaxonomiesQuery {
            allTaxonomies(
              filter: { type: { equalTo: ${
                type === 'Lebensräume' ? 'LEBENSRAUM' : 'ART'
              } } }
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

  if (isLoading) return <LoadingRow level={2} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allTaxonomies?.nodes ?? []) {
    const count = node.objectsByTaxonomyId.totalCount
    const data = {
      label: node.name,
      id: node.id,
      url: [type, node.id],
      childrenCount: count,
      info: isLoading ? '...' : count,
      menuType: 'CmTaxonomy',
    }
    const isOpen = taxId === node.id

    nodes.push(
      <div key={node.id}>
        <Row data={data} />
        {isOpen && <TopLevelObject type={type} />}
      </div>,
    )
  }

  return nodes
}

export default Tax
