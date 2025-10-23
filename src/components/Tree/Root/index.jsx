import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { Arten } from './Arten/index.jsx'
import LR from './LR/index.jsx'
import PC from './PC/index.jsx'
import Users from './Users/index.jsx'
import Organizations from './Organizations/index.jsx'
import { storeContext } from '../../../storeContext.js'
import LoadingRow from '../LoadingRow.jsx'

export const Root = observer(() => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const hasToken = !!store.login.token

  const { data, isLoading } = useQuery({
    queryKey: ['tree', 'root', hasToken],
    queryFn: () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      return apolloClient.query({
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
      <Arten
        isLoading={isLoading}
        count={data?.data?.arten?.totalCount}
      />
      <LR
        isLoading={isLoading}
        count={data?.data?.lebensraeume?.totalCount}
      />
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
})
