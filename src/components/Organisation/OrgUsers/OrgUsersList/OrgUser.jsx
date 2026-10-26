import { useState, Suspense } from 'react'
import IconButton from '@mui/material/IconButton'
import { MdClear } from 'react-icons/md'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { activeNodeArrayAtom } from '../../../../store/index.ts'
import { apiFetch } from '../../../../modules/api.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

import styles from './OrgUser.module.css'

export const OrgUser = ({ orgUser, orgUsersRefetch }) => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const name = activeNodeArray.length > 1 ? activeNodeArray[1] : 'none'

  const { data: allUsersData, error: allUsersError } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => apiFetch('/user?select=id,name'),
  })

  const {
    data: orgData,
    error: orgUsersError,
    refetch,
  } = useQuery({
    queryKey: ['organizationUsersByName', name],
    queryFn: async () => {
      const [orgs, roles] = await Promise.all([
        apiFetch(
          `/organization?select=id,name&name=eq.${encodeURIComponent(name)}`,
        ),
        apiFetch('/role?select=name'),
      ])
      return { org: orgs?.[0], roles }
    },
  })

  const [userId, setUserId] = useState(orgUser.userId)
  const [role, setRole] = useState(orgUser.role || null)

  const users = allUsersData ?? []
  const orgName = orgData?.org?.name ?? ''
  const user = users.find((user) => user.id === userId)
  const userName = user ? user.name || '' : ''
  const userNames = users.map((u) => u.name).sort()
  const roles = (orgData?.roles ?? []).map((role) => role.name).sort()

  const [nameError, setNameError] = useState()
  const onChangeName = async (e) => {
    const val = e.target.value
    const user = users.find((u) => u.name === val)
    if (user && user.id) {
      try {
        await apiFetch(`/organization_user?id=eq.${orgUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organization_id: orgUser.organizationId,
            user_id: user.id,
            role,
          }),
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
    try {
      await apiFetch(`/organization_user?id=eq.${orgUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: orgUser.organizationId,
          user_id: userId,
          role: newRole,
        }),
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
    await apiFetch(`/organization_user?id=eq.${orgUser.id}`, {
      method: 'DELETE',
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
}
