import { useMemo, Suspense } from 'react'
import SimpleBar from 'simplebar-react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Filter } from './Filter/index.jsx'
import { TreeContextMenu } from './contextmenu/TreeContextMenu.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { constants } from '../../modules/constants.js'
import { apiFetch } from '../../modules/api.js'
import { Root } from './Root/index.jsx'
import { LoadingRow } from './LoadingRow.jsx'
import { loginUsernameAtom } from '../../store/index.ts'
import { IntoViewScroller } from './IntoViewScroller.jsx'

import styles from './index.module.css'

const getUserIsTaxWriter = (users) => {
  const userRoles = (users?.[0]?.organizationUsers ?? []).map((r) => r?.role)
  return (
    userRoles.includes('orgAdmin') || userRoles.includes('orgTaxonomyWriter')
  )
}

export const Tree = () => {
  const loginUsername = useAtomValue(loginUsernameAtom)

  const { error, data } = useQuery({
    queryKey: ['tree', 'userRole', loginUsername],
    queryFn: () =>
      apiFetch(
        `/user?select=id,organizationUsers:organization_user(id,role)&name=eq.${encodeURIComponent(loginUsername ?? '')}`,
      ),
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
        <TreeContextMenu userIsTaxWriter={userIsTaxWriter} />
      </div>
    </ErrorBoundary>
  )
}
