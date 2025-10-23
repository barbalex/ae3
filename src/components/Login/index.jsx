import { useState, useContext, useRef } from 'react'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import {
  MdVisibility as VisibilityIcon,
  MdVisibilityOff as VisibilityOffIcon,
} from 'react-icons/md'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'

import { fetchLogin } from './fetchLogin.js'
import idbContext from '../../idbContext.js'
import storeContext from '../../storeContext.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

const Container = styled.div`
  padding: 10px;
`
const StyledButton = styled(Button)`
  border: 1px solid !important;
  margin-top: 5px;
`
const StyledSnackbar = styled(Snackbar)`
  div {
    min-width: auto;
    background-color: #2e7d32 !important;
  }
`

const Login = observer(() => {
  const apolloClient = useApolloClient()
  const idb = useContext(idbContext)
  const store = useContext(storeContext)
  const { login } = store
  const { token, setLogin } = login

  const navigate = useNavigate()

  const [name, changeName] = useState('')
  const [pass, changePass] = useState('')
  const [showPass, changeShowPass] = useState(false)
  const [nameErrorText, changeNameErrorText] = useState('')
  const [passErrorText, changePassErrorText] = useState('')
  const [loginSuccessfull, changeLoginSuccessfull] = useState(false)

  const nameInput = useRef(null)
  const passwordInput = useRef(null)

  const doFetchLogin = (namePassed, passPassed, navigate) =>
    fetchLogin({
      client: apolloClient,
      changeNameErrorText,
      changePassErrorText,
      name,
      changeName,
      pass,
      changePass,
      changeLoginSuccessfull,
      namePassed,
      passPassed,
      idb,
      store,
      nameInput,
      passwordInput,
      navigate,
    })
  const onLogout = () => {
    idb.users.clear()
    setLogin({
      username: '',
      token: '',
    })
  }
  const onBlurName = (e) => {
    changeNameErrorText('')
    const name = e.target.value
    changeName(name)
    if (!name) {
      changeNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
    } else if (pass) {
      doFetchLogin(name, pass, navigate)
    }
  }
  const onBlurPassword = (e) => {
    changePassErrorText('')
    const pass = e.target.value
    changePass(pass)
    if (!pass) {
      changePassErrorText('Bitte Passwort eingeben')
    } else if (name) {
      doFetchLogin(name, pass, navigate)
    }
  }
  const onKeyPressName = (e) => e.key === 'Enter' && onBlurName(e)
  const onKeyPressPass = (e) => e.key === 'Enter' && onBlurPassword(e)
  const onClickTogglePass = () => changeShowPass(!showPass)
  const onMouseDownTogglePass = (e) => e.preventDefault()

  return (
    <ErrorBoundary>
      <Container>
        {!token && (
          <FormControl
            fullWidth
            error={!!nameErrorText}
            variant="standard"
          >
            <TextField
              inputRef={nameInput}
              label="Name"
              defaultValue={name}
              onBlur={onBlurName}
              fullWidth
              autoFocus
              onKeyPress={onKeyPressName}
              autoComplete="username"
              variant="standard"
            />
            <FormHelperText id="name-error-text">
              {nameErrorText}
            </FormHelperText>
          </FormControl>
        )}
        {!token && (
          <FormControl
            fullWidth
            error={!!passErrorText}
            variant="standard"
          >
            <InputLabel htmlFor="password">Passwort</InputLabel>
            <Input
              id="adornment-password"
              inputRef={passwordInput}
              type={showPass ? 'text' : 'password'}
              defaultValue={pass}
              onBlur={onBlurPassword}
              fullWidth
              onKeyPress={onKeyPressPass}
              autoComplete="current-password"
              autoCorrect="off"
              spellCheck="false"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={onClickTogglePass}
                    onMouseDown={onMouseDownTogglePass}
                    title={showPass ? 'verstecken' : 'anzeigen'}
                    size="large"
                  >
                    {showPass ?
                      <VisibilityOffIcon />
                    : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="name-error-text">
              {passErrorText}
            </FormHelperText>
          </FormControl>
        )}
        {!token && <StyledButton color="inherit">anmelden</StyledButton>}
        {!!token && (
          <StyledButton
            onClick={onLogout}
            color="inherit"
          >
            abmelden
          </StyledButton>
        )}
        <StyledSnackbar
          open={loginSuccessfull}
          message={`Willkommen ${name}`}
        />
      </Container>
    </ErrorBoundary>
  )
})

export default Login
