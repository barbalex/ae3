import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Filter } from './Filter/index.jsx'
import { TreeContextMenu } from './contextmenu/TreeContextMenu.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { apiFetch } from '../../modules/api.js'
import { VirtualizedTree } from './VirtualizedTree.jsx'
import { loginUsernameAtom } from '../../store/index.ts'

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
        <VirtualizedTree />
        <TreeContextMenu userIsTaxWriter={userIsTaxWriter} />
      </div>
    </ErrorBoundary>
  )
}
