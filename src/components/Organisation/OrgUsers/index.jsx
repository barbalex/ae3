import { Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import IconButton from '@mui/material/IconButton'
import { MdAdd as AddIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { createOrgUserMutation } from './createOrgUserMutation.js'
import { OrgUsersList } from './OrgUsersList/index.jsx'
import { activeNodeArrayAtom } from '../../../store/index.ts'
import { Spinner } from '../../shared/Spinner.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

const orgUsersQuery = gql`
  query orgUsersQuery($id: UUID!) {
    organizationById(id: $id) {
      id
      name
      organizationUsersByOrganizationId {
        totalCount
        nodes {
          id
          organizationId
          userId
          nodeId
          userByUserId {
            id
            name
          }
          role
        }
      }
    }
    allRoles {
      nodes {
        nodeId
        name
      }
    }
  }
`

export const OrgUsers = () => {
  const apolloClient = useApolloClient()
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error, refetch } = useQuery({
    queryKey: ['organizationUsers', id],
    queryFn: () =>
      apolloClient.query({
        query: orgUsersQuery,
        variables: { id },
      }),
  })

  const orgUsers =
    data?.data?.organizationById?.organizationUsersByOrganizationId?.nodes ?? []
  const orgUserSorted = sortBy(orgUsers, [
    (orgUser) =>
      `${orgUser.userByUserId ? orgUser.userByUserId.name : 'zzzzz'}${
        orgUser.role ? orgUser.role : 'zzzzz'
      }`,
  ])
  const organizationId =
    data?.data?.organizationById?.id ?? '99999999-9999-9999-9999-999999999999'

  const onClickNew = async () => {
    await apolloClient.mutate({
      mutation: createOrgUserMutation,
      variables: {
        organizationId,
      },
      /**
       * adding to cache seems to be hard
       * so just refetch
       */
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
