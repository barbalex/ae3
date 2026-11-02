import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Filter } from './Filter/index'
import { TreeContextMenu } from './contextmenu/TreeContextMenu'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { apiFetch } from '../../modules/api'
import { VirtualizedTree } from './VirtualizedTree'
import { loginUsernameAtom } from '../../store'

import styles from './index.module.css'

const getUserIsTaxWriter = (users: any) => {
  const userRoles = (users?.[0]?.organizationUsers ?? []).map(
    (r: any) => r?.role,
  )
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
