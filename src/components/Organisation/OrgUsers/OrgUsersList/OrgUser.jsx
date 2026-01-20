import { useState, useContext, Suspense } from 'react'
import IconButton from '@mui/material/IconButton'
import { MdClear } from 'react-icons/md'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { set } from 'es-toolkit/compat'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { updateOrgUserMutation } from './updateOrgUserMutation.js'
import { deleteOrgUserMutation } from './deleteOrgUserMutation.js'
import { storeContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

import styles from './OrgUser.module.css'

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

export const OrgUser = observer(({ orgUser, orgUsersRefetch }) => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const name = activeNodeArray.length > 1 ? activeNodeArray[1] : 'none'

  const { data: allUsersData, error: allUsersError } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () =>
      apolloClient.query({
        query: allUsersQuery,
      }),
  })

  const {
    data: orgUsersData,
    error: orgUsersError,
    refetch,
  } = useQuery({
    queryKey: ['organizationUsersByName', name],
    queryFn: () =>
      apolloClient.query({
        query: orgUsersQuery,
        variables: { name },
      }),
  })

  const [userId, setUserId] = useState(orgUser.userId)
  const [role, setRole] = useState(orgUser.role || null)

  const users = allUsersData?.data?.allUsers?.nodes ?? []
  const orgName = orgUsersData?.data?.organizationByName?.name ?? ''
  const user = users.find((user) => user.id === userId)
  const userName = user ? user.name || '' : ''
  const userNames = users.map((u) => u.name).sort()
  const roles = (orgUsersData?.data?.allRoles?.nodes ?? [])
    .map((role) => role.name)
    .sort()

  const [nameError, setNameError] = useState()
  const onChangeName = async (e) => {
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
        await apolloClient.mutate({
          mutation: updateOrgUserMutation,
          variables,
        })
      } catch (error) {
        console.log(error)
        setUserId('')
        return setNameError(error.message)
      }
      refetch()
      setUserId(user.id)
      setNameError(undefined)
      orgUsersRefetch()
    }
  }

  const [roleError, setRoleError] = useState()
  const onChangeRole = async (event) => {
    const newRole = event.target.value
    const variables = {
      nodeId: orgUser.nodeId,
      organizationId: orgUser.organizationId,
      userId,
      role: newRole,
    }
    try {
      await apolloClient.mutate({
        mutation: updateOrgUserMutation,
        variables,
      })
    } catch (error) {
      console.log('error.message:', error.message)
      setRole('')
      return setRoleError(error?.message)
    }
    refetch()
    setRole(newRole)
    setRoleError(undefined)
    orgUsersRefetch()
  }

  const onClickDelete = async () => {
    await apolloClient.mutate({
      mutation: deleteOrgUserMutation,
      variables: { id: orgUser.id },
    })
    refetch()
    orgUsersRefetch()
  }

  if (orgUsersError) {
    return (
      <div
        className={styles.container}
      >{`Fehler: ${orgUsersError.message}`}</div>
    )
  }
  if (allUsersError) {
    return (
      <div
        className={styles.container}
      >{`Fehler: ${allUsersError.message}`}</div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <div className={styles.container}>
          <FormControl
            className={styles.formControl}
            variant="standard"
          >
            <InputLabel htmlFor="Benutzer">Benutzer</InputLabel>
            <Select
              value={userName}
              onChange={onChangeName}
              input={<Input id="Benutzer" />}
            >
              {userNames.map((u) => (
                <MenuItem
                  key={u}
                  value={u}
                >
                  {u}
                </MenuItem>
              ))}
            </Select>
            {!!nameError && (
              <FormHelperText id={`RolleErrorText`}>{nameError}</FormHelperText>
            )}
          </FormControl>
          <FormControl
            className={styles.formControl}
            variant="standard"
          >
            <InputLabel htmlFor="Rolle">Rolle</InputLabel>
            <Select
              value={role || ''}
              onChange={onChangeRole}
              input={<Input id="Rolle" />}
            >
              {roles.map((u) => (
                <MenuItem
                  key={u}
                  value={u}
                >
                  {u}
                </MenuItem>
              ))}
            </Select>
            {!!roleError && (
              <FormHelperText id={`RolleErrorText`}>{roleError}</FormHelperText>
            )}
          </FormControl>
          <IconButton
            title="löschen"
            aria-label="löschen"
            onClick={onClickDelete}
          >
            <MdClear color="error" />
          </IconButton>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
})
