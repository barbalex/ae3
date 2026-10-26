import { useEffect, useState, Suspense } from 'react'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useParams } from 'react-router'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useSetAtom, useAtomValue } from 'jotai'

import { Roles } from './Roles.jsx'
import { PCs } from './PCs.jsx'
import { TCs } from './TCs.jsx'
import { apiFetch } from '../../modules/api.js'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import {
  scrollIntoViewAtom,
  loginUsernameAtom,
} from '../../store/index.ts'

import styles from './index.module.css'

const User = () => {
  const { userId } = useParams()

  const queryClient = useQueryClient()

  const loginUsername = useAtomValue(loginUsernameAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const { data, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      apiFetch(
        `/user?id=eq.${userId}&select=id,name,email,organizationUsers:organization_user(id,organizationByOrganizationId:organization_id(id,name),role),propertyCollectionsByImportedBy:property_collection!property_collection_imported_by_fkey(id,name),taxonomiesByImportedBy:taxonomy!taxonomy_imported_by_fkey(id,name)`,
      ),
  })
  const user = data?.[0] ?? {}

  const [name, setName] = useState(user?.name)
  const [nameErrorText, setNameErrorText] = useState('')
  const [email, setEmail] = useState(user?.email)
  const [emailErrorText, setEmailErrorText] = useState('')
  const [passNew, setPassNew] = useState('')
  const [tab, setTab] = useState(0)

  const id = user?.id
  const orgUsers = user?.organizationUsers ?? []
  const pcs = user?.propertyCollectionsByImportedBy ?? []
  const tcs = user?.taxonomiesByImportedBy ?? []
  const saveEnabled =
    passNew ||
    (!!name && !!data && !!user && name !== user?.name) ||
    (!!email && !!data && !!user && email !== user?.email)
  const userIsLoggedIn =
    !!user && !!loginUsername && user?.name === loginUsername

  useEffect(() => {
    setName(user?.name)
    setEmail(user?.email)
  }, [user])
  const onChangeTab = (event, value) => setTab(value)
  const onChangeName = (e) => setName(e.target.value)
  const onChangeEmail = (e) => setEmail(e.target.value)
  const onChangePassNew = (e) => setPassNew(e.target.value)

  const onSave = async () => {
    try {
      await apiFetch(`/user?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          passNew ?
            { name, email, pass: passNew }
          : { name, email },
        ),
      })
    } catch (error) {
      const isProperEmailError = error.message?.includes('proper_email')
      if (isProperEmailError) {
        const message = 'Email ist nicht gültig'
        return setEmailErrorText(message)
      }
      return console.log(error)
    }
    refetch()
    // refetch to update
    await queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    await queryClient.invalidateQueries({
      queryKey: [`user`],
    })
    scrollIntoView()
    setNameErrorText('')
    setEmailErrorText('')
    setPassNew('')
  }

  if (error) {
    return (
      <div className={styles.leContainer}>
        `Fehler beim Laden der Daten: ${error.message}`
      </div>
    )
  }

  if (!user?.id) return null

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div>
          <div className={styles.orgContainer}>
            <FormControl
              fullWidth
              error={!!nameErrorText}
              aria-describedby="name-error-text"
              variant="standard"
            >
              <TextField
                name="name"
                label="Name"
                value={name || ''}
                onChange={onChangeName}
                fullWidth
                autoComplete="username"
                variant="standard"
              />
              <FormHelperText id="name-error-text">
                {nameErrorText}
              </FormHelperText>
            </FormControl>
            <FormControl
              fullWidth
              error={!!emailErrorText}
              aria-describedby="email-error-text"
              variant="standard"
            >
              <TextField
                name="email"
                label="Email"
                value={email || ''}
                onChange={onChangeEmail}
                fullWidth
                autoComplete="email"
                variant="standard"
              />
              <FormHelperText id="email-error-text">
                {emailErrorText}
              </FormHelperText>
            </FormControl>
            {userIsLoggedIn && (
              <FormControl
                fullWidth
                variant="standard"
              >
                <TextField
                  name="passNew"
                  label="Passwort ändern"
                  type="password"
                  value={passNew || ''}
                  onChange={onChangePassNew}
                  fullWidth
                  autoComplete="new-password"
                  variant="standard"
                />
              </FormControl>
            )}
            <Button
              onClick={onSave}
              disabled={!saveEnabled}
              color="inherit"
              className={styles.saveButton}
            >
              Änderungen speichern
            </Button>
          </div>
          <Paper className={styles.paper}>
            <Tabs
              variant="fullWidth"
              value={tab}
              onChange={onChangeTab}
              indicatorColor="primary"
            >
              <Tab label={`Rollen (${orgUsers.length})`} />
              <Tab label={`importierte Taxonomien (${tcs.length})`} />
              <Tab
                label={`importierte Eigenschaften-Sammlungen (${pcs.length})`}
              />
            </Tabs>
          </Paper>
          {tab === 0 && <Roles orgUsers={orgUsers} />}
          {tab === 1 && <TCs tcs={tcs} />}
          {tab === 2 && <PCs pcs={pcs} />}
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

export default User
