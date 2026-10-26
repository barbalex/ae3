import { Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import IconButton from '@mui/material/IconButton'
import { MdAdd as AddIcon } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { OrgUsersList } from './OrgUsersList/index.jsx'
import { activeNodeArrayAtom } from '../../../store/index.ts'
import { apiFetch } from '../../../modules/api.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

export const OrgUsers = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error, refetch } = useQuery({
    queryKey: ['organizationUsers', id],
    queryFn: () =>
      apiFetch(
        `/organization?id=eq.${id}&select=id,name,organizationUsers:organization_user(id,organizationId:organization_id,userId:user_id,userByUserId:user_id(id,name),role)`,
      ),
  })

  const organization = data?.[0]
  const orgUsers = organization?.organizationUsers ?? []
  const orgUserSorted = sortBy(orgUsers, [
    (orgUser) =>
      `${orgUser.userByUserId ? orgUser.userByUserId.name : 'zzzzz'}${
        orgUser.role ? orgUser.role : 'zzzzz'
      }`,
  ])
  const organizationId =
    organization?.id ?? '99999999-9999-9999-9999-999999999999'

  const onClickNew = async () => {
    await apiFetch('/organization_user?select=id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ organization_id: organizationId }]),
    })
    refetch()
  }

  if (error) {
    return <div className={styles.container}>{`Fehler: ${error.message}`}</div>
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={styles.container}>
          <OrgUsersList
            orgUsers={orgUserSorted}
            orgUsersRefetch={refetch}
          />
          <div className={styles.buttonContainer}>
            <IconButton
              title="Neuen Benutzer mit Rolle erstellen"
              aria-label="Neue Rolle vergeben"
              onClick={onClickNew}
              className={styles.addNewButton}
            >
              <AddIcon color="error" />
            </IconButton>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
