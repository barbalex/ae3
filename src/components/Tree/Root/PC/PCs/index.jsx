import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Row } from '../../../Row/index.jsx'
import { LoadingRow } from '../../../LoadingRow.jsx'
import { Folders } from './Folders.jsx'

export const PCs = () => {
  const { pcId } = useParams()
  const apolloClient = useApolloClient()

  const { data, isLoading } = useQuery({
    queryKey: ['tree', 'pcs'],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return apolloClient.query({
        query: gql`
          query treePcsQuery {
            allPropertyCollections(orderBy: NAME_ASC) {
              nodes {
                id
                name
                propertyCollectionObjectsByPropertyCollectionId {
                  totalCount
                }
                relationsByPropertyCollectionId {
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

  for (const node of data?.data?.allPropertyCollections?.nodes ?? []) {
    const pcoCount =
      node.propertyCollectionObjectsByPropertyCollectionId?.totalCount ?? 0
    const relCount = node.relationsByPropertyCollectionId?.totalCount ?? 0

    const data = {
      label: node.name ?? node.id,
      id: node.id,
      url: ['Eigenschaften-Sammlungen', node.id],
      childrenCount: 2,
      info: pcoCount + relCount,
      menuType: 'CmPC',
    }
    const isOpen = pcId === node.id

    nodes.push(
      <div key={node.id}>
        <Row data={data} />
        {isOpen && (
          <Folders
            pc={node}
            pcoCount={pcoCount}
            relCount={relCount}
          />
        )}
      </div>,
    )
  }

  return nodes
}
