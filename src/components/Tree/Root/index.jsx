import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import Arten from './Arten'
import LR from './LR'
import PC from './PC'
import Users from './Users'
import Organizations from './Organizations'
import storeContext from '../../../storeContext'
import LoadingRow from '../LoadingRow'

const Root = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const hasToken = !!store.login.token

  const { data, isLoading } = useQuery({
    queryKey: ['treeRoot', hasToken],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return client.query({
        query: gql`
          query treeRootQuery($hasToken: Boolean!) {
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
            allUsers @include(if: $hasToken) {
              totalCount
            }
            allOrganizations @include(if: $hasToken) {
              totalCount
            }
          }
        `,
        variables: { hasToken },
        fetchPolicy: 'no-cache',
      })
    },
  })

  if (isLoading) return <LoadingRow level={1} />

  if (!data) return null

  return (
    <>
      <Arten isLoading={isLoading} count={data?.data?.arten?.totalCount} />
      <LR isLoading={isLoading} count={data?.data?.lebensraeume?.totalCount} />
      <PC
        isLoading={isLoading}
        count={data?.data?.allPropertyCollections?.totalCount}
      />
      {hasToken && (
        <>
          <Users
            isLoading={isLoading}
            count={data?.data?.allUsers?.totalCount}
          />
          <Organizations
            isLoading={isLoading}
            count={data?.data?.allOrganizations?.totalCount}
          />
        </>
      )}
    </>
  )
}

export default Root
