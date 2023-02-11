import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import Row from '../../../Row'
import Folders from './Folders'

const PCs = () => {
  const { pcId } = useParams()
  const client = useApolloClient()
  console.log('Tree Pcs, pcId:', pcId)

  const { data, isLoading } = useQuery({
    queryKey: ['treePcs'],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return client.query({
        query: gql`
          query treePcsQuery {
            allPropertyCollections(orderBy: NAME_ASC) {
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

  if (isLoading) return <Row data={{ label: '...' }} />

  if (!data) return null

  return data?.data?.allPropertyCollections?.nodes?.map((node) => {
    const data = {
      label: node.name,
      id: node.id,
      url: ['Eigenschaften-Sammlungen', node.id],
      childrenCount: 2,
      info: undefined,
      menuType: 'CmPC',
    }
    const isOpen = pcId === node.id

    return (
      <>
        <Row key={node.id} data={data} />
        {isOpen && <Folders pc={node} />}
      </>
    )
  })
}

export default PCs
