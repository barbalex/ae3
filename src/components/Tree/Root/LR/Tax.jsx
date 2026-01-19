import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { TopLevelObject } from './TopLevelObject.jsx'

export const Tax = ({ type = 'Lebensräume' }) => {
  const apolloClient = useApolloClient()
  const { taxId } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['tree', 'lrTax', type],
    queryFn: () => {
      return apolloClient.query({
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
      })
    },
  })

  if (isLoading) return <LoadingRow level={2} />

  if (!data) return null

  const nodes = []

  for (const node of data?.data?.allTaxonomies?.nodes ?? []) {
    const count = node.objectsByTaxonomyId.totalCount
    const data = {
      label: node.name ?? node.id,
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
