import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useAtomValue } from 'jotai'

import { Arten } from './Arten/index.jsx'
import { LR } from './LR/index.jsx'
import { PC } from './PC/index.jsx'
import { UsersFolder } from './Users/index.jsx'
import { OrganizationsFolder } from './Organizations/index.jsx'
import { storeContext } from '../../../storeContext.js'
import { loginTokenAtom } from '../../../jotaiStore/index.ts'

export const Root = observer(() => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const loginToken = useAtomValue(loginTokenAtom)
  const hasToken = !!loginToken

  const { data } = useQuery({
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
      })
    },
    suspense: true,
  })

  if (!data) return null

  return (
    <>
      <Arten count={data?.data?.arten?.totalCount} />
      <LR count={data?.data?.lebensraeume?.totalCount} />
      <PC count={data?.data?.allPropertyCollections?.totalCount} />
      {hasToken && (
        <>
          <UsersFolder count={data?.data?.allUsers?.totalCount} />
          <OrganizationsFolder
            count={data?.data?.allOrganizations?.totalCount}
          />
        </>
      )}
    </>
  )
})
