import { useMemo, useContext } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { useQuery } from '@tanstack/react-query'

import { Filter } from './Filter/index.jsx'
import { treeQuery } from './treeQuery.js'
import { CmBenutzerFolder } from './contextmenu/BenutzerFolder.jsx'
import { CmBenutzer } from './contextmenu/Benutzer.jsx'
import { CmObject } from './contextmenu/Object.jsx'
import { CmTaxonomy } from './contextmenu/Taxonomy.jsx'
import { CmType } from './contextmenu/Type.jsx'
import { CmPCFolder } from './contextmenu/PCFolder.jsx'
import { CmPC } from './contextmenu/PC.jsx'
import { storeContext } from '../../storeContext.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { constants } from '../../modules/constants.js'
import { Root } from './Root/index.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'

import { errorContainer } from './index.module.css'

const getUserIsTaxWriter = (data) => {
  const userRoles = (
    data?.data?.userByName?.organizationUsersByUserId?.nodes ?? []
  ).map((r) => r?.role)
  return (
    userRoles.includes('orgAdmin') || userRoles.includes('orgTaxonomyWriter')
  )
}

export const Tree = observer(() => {
  const store = useContext(storeContext)

  const apolloClient = useApolloClient()

  const { error, data } = useQuery({
    queryKey: ['tree', 'userRole', store.login.username],
    queryFn: () =>
      apolloClient.query({
        query: treeQuery,
        variables: { username: store.login.username ?? '' },
        // seems that react-query cache is not working
        // no idea why
        fetchPolicy: 'no-cache',
      }),
  })

  const userIsTaxWriter = getUserIsTaxWriter(data)

  if (error) {
    return (
      <div
        className={errorContainer}
      >{`Error fetching data: ${error.message}`}</div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="tree-container">
        <Filter />
        <SimpleBar
          style={{
            height: `calc(100vh - ${constants.appBarHeight}px - 39px)`,
            flex: '1 1 auto',
            overflowY: 'auto',
            contain: 'paint layout style',
          }}
        >
          <Root />
        </SimpleBar>
        <IntoViewScroller />
        <CmBenutzerFolder />
        <CmBenutzer />
        {userIsTaxWriter && (
          <>
            <CmObject />
            <CmTaxonomy />
            <CmType />
            <CmPCFolder />
            <CmPC />
          </>
        )}
      </div>
    </ErrorBoundary>
  )
})
