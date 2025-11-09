import { useEffect, useState, useContext, Suspense } from 'react'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useApolloClient } from '@apollo/client/react'
import { CombinedGraphQLErrors } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import { query } from './query.js'
import { Roles } from './Roles.jsx'
import { PCs } from './PCs.jsx'
import { TCs } from './TCs.jsx'
import { updateUserMutation } from './updateUserMutation.js'
import { updateUserMutationWithPass } from './updateUserMutationWithPass.js'
import { storeContext } from '../../storeContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import {
  leContainer,
  orgContainer,
  saveButton,
  paper,
} from './index.module.css'

const User = observer(() => {
  const { userId } = useParams()

  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const { login, scrollIntoView } = store

  const { data, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: {
          id: userId,
        },
      }),
  })
  const user = data?.data?.userById ?? {}

  const [name, setName] = useState(user?.name)
  const [nameErrorText, setNameErrorText] = useState('')
  const [email, setEmail] = useState(user?.email)
  const [emailErrorText, setEmailErrorText] = useState('')
  const [passNew, setPassNew] = useState('')
  const [tab, setTab] = useState(0)

  const id = user?.id
  const orgUsers = user?.organizationUsersByUserId?.nodes ?? []
  const pcs = user?.propertyCollectionsByImportedBy?.nodes ?? []
  const tcs = user?.taxonomiesByImportedBy?.nodes ?? []
  const saveEnabled =
    passNew ||
    (!!name && !!data && !!user && name !== user?.name) ||
    (!!email && !!data && !!user && email !== user?.email)
  const userIsLoggedIn =
    !!user && !!login.username && user?.name === login.username

  useEffect(() => {
    setName(user?.name)
    setEmail(user?.email)
  }, [user])
  const onChangeTab = (event, value) => setTab(value)
  const onChangeName = (e) => setName(e.target.value)
  const onChangeEmail = (e) => setEmail(e.target.value)
  const onChangePassNew = (e) => setPassNew(e.target.value)

  const onSave = async () => {
    const variables =
      passNew ?
        {
          username: name,
          email,
          id,
          pass: passNew,
        }
      : {
          username: name,
          email,
          id,
        }
    const mutation = passNew ? updateUserMutationWithPass : updateUserMutation
    const { error } = await apolloClient.mutate({
      mutation,
      variables,
    })
    if (CombinedGraphQLErrors.is(error)) {
      const messages = error.graphQLErrors.map((x) => x.message).toString()
      const isProperEmailError = messages.includes('proper_email')
      if (isProperEmailError) {
        const message = 'Email ist nicht gültig'
        return setEmailErrorText(message)
      }
      return console.log(error)
    }
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
      <div className={leContainer}>
        `Fehler beim Laden der Daten: ${error.message}`
      </div>
    )
  }

  if (!user) return null

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div>
          <div className={orgContainer}>
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
              className={saveButton}
            >
              Änderungen speichern
            </Button>
          </div>
          <Paper className={paper}>
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
})

export default User
