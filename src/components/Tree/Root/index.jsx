import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import Arten from './Arten'

const Root = () => {
  const client = useApolloClient()

  const { data, isLoading } = useQuery({
    queryKey: ['treeRoot'],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return client.query({
        query: gql`
          query treeRootQuery {
            arten: allTaxonomies(filter: { type: { equalTo: ART } }) {
              totalCount
            }
            lebensraeume: allTaxonomies(
              filter: { type: { equalTo: LEBENSRAUM } }
            ) {
              totalCount
            }
            allPropertyCollections {
              totalCount
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
    },
  })

  if (!data) return null

  return (
    <>
      <Arten isLoading={isLoading} count={data?.data?.arten?.totalCount} />
    </>
  )
}

export default Root
