import { useContext, Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import IconButton from '@mui/material/IconButton'
import { MdAdd as AddIcon } from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { createOrgUserMutation } from './createOrgUserMutation.js'
import { OrgUsersList } from './OrgUsersList/index.jsx'
import { storeContext } from '../../../storeContext.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import { container, addNewButton, buttonContainer } from './index.module.css'

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

export const OrgUsers = observer(() => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  // use tanstack-query to enable refetching from delete?
  const { data, error, refetch } = useQuery(orgUsersQuery, {
    variables: { id },
  })

  const orgUsers =
    data?.organizationById?.organizationUsersByOrganizationId?.nodes ?? []
  const orgUserSorted = sortBy(orgUsers, [
    (orgUser) =>
      `${orgUser.userByUserId ? orgUser.userByUserId.name : 'zzzzz'}${
        orgUser.role ? orgUser.role : 'zzzzz'
      }`,
  ])
  const organizationId =
    data?.organizationById?.id ?? '99999999-9999-9999-9999-999999999999'

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
    return <div className={container}>{`Fehler: ${error.message}`}</div>
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={container}>
          <OrgUsersList
            orgUsers={orgUserSorted}
            orgUsersRefetch={refetch}
          />
          <div className={buttonContainer}>
            <IconButton
              title="Neuen Benutzer mit Rolle erstellen"
              aria-label="Neue Rolle vergeben"
              onClick={onClickNew}
              className={addNewButton}
            >
              <AddIcon color="error" />
            </IconButton>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
})
