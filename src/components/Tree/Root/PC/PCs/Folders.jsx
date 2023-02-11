import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import Row from '../../../Row'

const PcFolders = ({ pc }) => {
  const client = useApolloClient()

  const { data, isLoading } = useQuery({
    queryKey: ['treePcFolders'],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return client.query({
        query: gql`
          query treePcsQuery($id: UUID!) {
            propertyCollectionById(id: $id) {
              id
              propertyCollectionObjectsByPropertyCollectionId {
                totalCount
              }
              relationsByPropertyCollectionId {
                totalCount
              }
            }
          }
        `,
        variables: { id: pc.id },
        fetchPolicy: 'no-cache',
      })
    },
  })

  if (isLoading) return <Row data={{ label: '...' }} />

  if (!data) return null

  const dataPc = {
    label: 'Eigenschaften',
    id: `${pc.id}/Eigenschaften`,
    url: ['Eigenschaften-Sammlungen', pc.id, 'Eigenschaften'],
    childrenCount: 0,
    info: data?.data?.propertyCollectionById
      ?.propertyCollectionObjectsByPropertyCollectionId?.totalCount,
    menuType: 'pCProperties',
  }
  const dataRel = {
    label: 'Beziehungen',
    id: `${pc.id}/Beziehungen`,
    url: ['Eigenschaften-Sammlungen', pc.id, 'Beziehungen'],
    childrenCount: 0,
    info: data?.data?.propertyCollectionById?.relationsByPropertyCollectionId
      ?.totalCount,
    menuType: 'pCRelations',
  }

  return (
    <>
      <Row data={dataPc} />
      <Row data={dataRel} />
    </>
  )
}

export default PcFolders
