import { useState, useRef } from 'react'
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
import { useNavigate } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'

import { fetchLogin } from './fetchLogin.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { loginTokenAtom, setLoginAtom } from '../../store/index.ts'

import styles from './index.module.css'

const Login = () => {
  const queryClient = useQueryClient()
  const token = useAtomValue(loginTokenAtom)
  const setLogin = useSetAtom(setLoginAtom)

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
      changeNameErrorText,
      changePassErrorText,
      name,
      changeName,
      pass,
      changePass,
      changeLoginSuccessfull,
      namePassed,
      passPassed,
      nameInput,
      passwordInput,
      navigate,
    })
  const onLogout = async () => {
    setLogin({
      username: '',
      token: '',
    })
    // Invalidate tree query to refetch without token
    await queryClient.invalidateQueries({
      queryKey: ['tree'],
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
      <div className={styles.container}>
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
        {!token && (
          <Button
            className={styles.button}
            color="inherit"
          >
            anmelden
          </Button>
        )}
        {!!token && (
          <Button
            className={styles.button}
            onClick={onLogout}
            color="inherit"
          >
            abmelden
          </Button>
        )}
        <Snackbar
          open={loginSuccessfull}
          message={`Willkommen ${name}`}
          className={styles.snackbar}
        />
      </div>
    </ErrorBoundary>
  )
}

export default Login
