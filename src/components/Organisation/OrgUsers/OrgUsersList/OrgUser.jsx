import React, { useState, useCallback, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdClear } from 'react-icons/md'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import set from 'lodash/set'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import updateOrgUserMutation from './updateOrgUserMutation.js'
import deleteOrgUserMutation from './deleteOrgUserMutation.js'
import storeContext from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

const OrgUserDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`
const DeleteButton = styled(IconButton)`
  :hover {
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.12);
    text-decoration: none;
  }
`
const StyledFormControl = styled(FormControl)`
  margin: 10px 0 5px 0 !important;
  width: calc(50% - 24px);
`

const allUsersQuery = gql`
  query AllUsersQuery {
    allUsers {
      totalCount
      nodes {
        id
        name
        email
        organizationUsersByUserId {
          nodes {
            id
            organizationId
            role
            organizationByOrganizationId {
              id
              name
            }
          }
        }
      }
    }
  }
`
const orgUsersQuery = gql`
  query orgUsersQuery($name: String!) {
    organizationByName(name: $name) {
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

const OrgUser = ({ orgUser }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const name = activeNodeArray.length > 1 ? activeNodeArray[1] : 'none'

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery(allUsersQuery)
  const {
    data: orgUsersData,
    loading: orgUsersLoading,
    error: orgUsersError,
  } = useQuery(orgUsersQuery, {
    variables: {
      name,
    },
  })

  const [userId, setUserId] = useState(orgUser.userId)
  const [role, setRole] = useState(orgUser.role || null)

  const users = useMemo(
    () => allUsersData?.allUsers?.nodes ?? [],
    [allUsersData?.allUsers?.nodes],
  )
  const orgName = orgUsersData?.organizationByName?.name ?? ''
  const user = users.find((user) => user.id === userId)
  const userName = user ? user.name || '' : ''
  const userNames = users.map((u) => u.name).sort()
  const roles = (orgUsersData?.allRoles?.nodes ?? [])
    .map((role) => role.name)
    .sort()

  const [nameError, setNameError] = useState()
  const onChangeName = useCallback(
    async (e) => {
      const val = e.target.value
      const user = users.find((u) => u.name === val)
      if (user && user.id) {
        const variables = {
          nodeId: orgUser.nodeId,
          organizationId: orgUser.organizationId,
          userId: user.id,
          role,
        }
        try {
          await client.mutate({
            mutation: updateOrgUserMutation,
            variables,
            optimisticResponse: {
              updateOrganizationUser: {
                organizationUser: {
                  nodeId: orgUser.nodeId,
                  id: orgUser.id,
                  organizationId: orgUser.organizationId,
                  userId: user.id,
                  role,
                  __typename: 'OrganizationUser',
                },
                __typename: 'Mutation',
              },
            },
          })
        } catch (error) {
          console.log(error)
          setUserId('')
          return setNameError(error.message)
        }
        setUserId(user.id)
        setNameError(undefined)
      }
    },
    [users, orgUser.nodeId, orgUser.organizationId, orgUser.id, role, client],
  )
  const [roleError, setRoleError] = useState()
  const onChangeRole = useCallback(
    async (event) => {
      const newRole = event.target.value
      const variables = {
        nodeId: orgUser.nodeId,
        organizationId: orgUser.organizationId,
        userId,
        role: newRole,
      }
      try {
        await client.mutate({
          mutation: updateOrgUserMutation,
          variables,
          optimisticResponse: {
            updateOrganizationUser: {
              organizationUser: {
                nodeId: orgUser.nodeId,
                id: orgUser.id,
                organizationId: orgUser.organizationId,
                userId,
                role: newRole,
                __typename: 'OrganizationUser',
              },
              __typename: 'Mutation',
            },
          },
        })
      } catch (error) {
        console.log('error.message:', error.message)
        setRole('')
        return setRoleError(error?.message)
      }
      setRole(newRole)
      setRoleError(undefined)
    },
    [client, orgUser.id, orgUser.nodeId, orgUser.organizationId, userId],
  )
  const onClickDelete = useCallback(async () => {
    client.mutate({
      mutation: deleteOrgUserMutation,
      variables: {
        id: orgUser.id,
      },
      optimisticResponse: {
        deleteOrganizationUserById: {
          organizationUser: {
            id: orgUser.id,
            __typename: 'OrganizationUser',
          },
          __typename: 'Mutation',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      update: (proxy, { data: { deleteOrgUserMutation } }) => {
        const data = proxy.readQuery({
          query: orgUsersQuery,
          variables: { name: orgName },
        })
        const orgUsers =
          data?.organizationByName?.organizationUsersByOrganizationId?.nodes ??
          []
        const newOrgUsers = orgUsers.filter((u) => u.id !== orgUser.id)
        set(
          data,
          'organizationByName.organizationUsersByOrganizationId.nodes',
          newOrgUsers,
        )
        proxy.writeQuery({
          query: orgUsersQuery,
          variables: { name: orgName },
          data,
        })
      },
    })
  }, [client, orgName, orgUser.id])

  if (orgUsersLoading || allUsersLoading) {
    return null
  }
  if (orgUsersError) {
    return <OrgUserDiv>{`Fehler: ${orgUsersError.message}`}</OrgUserDiv>
  }
  if (allUsersError) {
    return <OrgUserDiv>{`Fehler: ${allUsersError.message}`}</OrgUserDiv>
  }

  return (
    <ErrorBoundary>
      <OrgUserDiv>
        <StyledFormControl variant="standard">
          <InputLabel htmlFor="Benutzer">Benutzer</InputLabel>
          <Select
            value={userName}
            onChange={onChangeName}
            input={<Input id="Benutzer" />}
          >
            {userNames.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
          {!!nameError && (
            <FormHelperText id={`RolleErrorText`}>{nameError}</FormHelperText>
          )}
        </StyledFormControl>
        <StyledFormControl variant="standard">
          <InputLabel htmlFor="Rolle">Rolle</InputLabel>
          <Select
            value={role || ''}
            onChange={onChangeRole}
            input={<Input id="Rolle" />}
          >
            {roles.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
          {!!roleError && (
            <FormHelperText id={`RolleErrorText`}>{roleError}</FormHelperText>
          )}
        </StyledFormControl>
        <DeleteButton
          title="löschen"
          aria-label="löschen"
          onClick={onClickDelete}
        >
          <Icon>
            <MdClear color="error" />
          </Icon>
        </DeleteButton>
      </OrgUserDiv>
    </ErrorBoundary>
  )
}

export default observer(OrgUser)
