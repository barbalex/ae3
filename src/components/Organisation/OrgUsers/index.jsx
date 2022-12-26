import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdAdd as AddIcon } from 'react-icons/md'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import createOrgUserMutation from './createOrgUserMutation'
import OrgUsersList from './OrgUsersList'
import storeContext from '../../../storeContext'
import Spinner from '../../shared/Spinner'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
`
const AddNewButton = styled(IconButton)`
  top: 10px !important;
  :hover {
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.12);
    text-decoration: none;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

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

const OrgUsers = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const id =
    activeNodeArray.length > 1
      ? activeNodeArray[1]
      : '99999999-9999-9999-9999-999999999999'
  const {
    data: orgUsersData,
    loading: orgUsersLoading,
    error: orgUsersError,
  } = useQuery(orgUsersQuery, {
    variables: {
      id,
    },
  })

  const orgUsers =
    orgUsersData?.organizationById?.organizationUsersByOrganizationId?.nodes ??
    []
  const orgUserSorted = sortBy(
    orgUsers,
    (orgUser) =>
      `${orgUser.userByUserId ? orgUser.userByUserId.name : 'zzzzz'}${
        orgUser.role ? orgUser.role : 'zzzzz'
      }`,
  )
  const organizationId =
    orgUsersData?.organizationById?.id ?? '99999999-9999-9999-9999-999999999999'

  const onClickNew = useCallback(async () => {
    await client.mutate({
      mutation: createOrgUserMutation,
      variables: {
        organizationId,
      },
      /**
       * adding to cache seems to be darn hard
       * so just refetch
       */
    })
    orgUsersData.refetch()
  }, [client, orgUsersData, organizationId])

  if (orgUsersLoading) {
    return <Spinner />
  }
  if (orgUsersError) {
    return <Container>{`Fehler: ${orgUsersError.message}`}</Container>
  }

  return (
    <ErrorBoundary>
      <Container>
        <OrgUsersList orgUsers={orgUserSorted} />
        <ButtonContainer>
          <AddNewButton
            title="Neuen Benutzer mit Rolle erstellen"
            aria-label="Neue Rolle vergeben"
            onClick={onClickNew}
          >
            <Icon>
              <AddIcon color="error" />
            </Icon>
          </AddNewButton>
        </ButtonContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(OrgUsers)
