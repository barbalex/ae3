import { useMemo, Suspense } from 'react'
import { useApolloClient } from '@apollo/client/react'
import SimpleBar from 'simplebar-react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Filter } from './Filter/index.jsx'
import { treeQuery } from './treeQuery.js'
import { CmBenutzerFolder } from './contextmenu/BenutzerFolder.jsx'
import { CmBenutzer } from './contextmenu/Benutzer.jsx'
import { CmObject } from './contextmenu/Object.jsx'
import { CmTaxonomy } from './contextmenu/Taxonomy.jsx'
import { CmType } from './contextmenu/Type.jsx'
import { CmPCFolder } from './contextmenu/PCFolder.jsx'
import { CmPC } from './contextmenu/PC.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { constants } from '../../modules/constants.js'
import { Root } from './Root/index.jsx'
import { LoadingRow } from './LoadingRow.jsx'
import { loginUsernameAtom } from '../../jotaiStore/index.ts'
import { IntoViewScroller } from './IntoViewScroller.jsx'

import styles from './index.module.css'

const getUserIsTaxWriter = (data) => {
  const userRoles = (
    data?.data?.userByName?.organizationUsersByUserId?.nodes ?? []
  ).map((r) => r?.role)
  return (
    userRoles.includes('orgAdmin') || userRoles.includes('orgTaxonomyWriter')
  )
}

export const Tree = () => {
  const loginUsername = useAtomValue(loginUsernameAtom)

  const apolloClient = useApolloClient()

  const { error, data } = useQuery({
    queryKey: ['tree', 'userRole', loginUsername],
    queryFn: () =>
      apolloClient.query({
        query: treeQuery,
        variables: { username: loginUsername ?? '' },
        // seems that react-query cache is not working
        // no idea why
      }),
  })

  const userIsTaxWriter = getUserIsTaxWriter(data)

  if (error) {
    return (
      <div
        className={styles.errorContainer}
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
          <Suspense fallback={<LoadingRow level={1} />}>
            <Root />
          </Suspense>
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
}
