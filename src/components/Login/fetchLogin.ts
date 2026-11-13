import { rpc } from '../../modules/api'
import { store, setLoginAtom, queryClientAtom } from '../../store'

type FetchLoginProps = {
  changeNameErrorText: (text: string | null) => void
  changePassErrorText: (text: string | null) => void
  name: string
  changeName: (name: string) => void
  pass: string
  changePass: (pass: string) => void
  changeLoginSuccessfull: (value: boolean) => void
  namePassed?: string
  passPassed?: string
  nameInput: { current: HTMLInputElement | null }
  passwordInput: { current: HTMLInputElement | null }
  navigate: (path: string) => void
}

export const fetchLogin = async ({
  changeNameErrorText,
  changePassErrorText,
  name: propsName,
  changeName,
  pass: propsPass,
  changePass,
  changeLoginSuccessfull,
  namePassed,
  passPassed,
  nameInput,
  passwordInput,
  navigate,
}: FetchLoginProps) => {
  const queryClient = store.get(queryClientAtom)

  if (!queryClient) {
    console.error('Query client not initialized')
    return
  }

  // when blurring fields need to pass event value
  // on the other hand when clicking on Anmelden button,
  // need to grab props
  const name = namePassed || propsName || nameInput.current?.value
  const pass = passPassed || propsPass || passwordInput.current?.value
  if (!name) {
    return changeNameErrorText('Bitte Benutzernamen eingeben')
  }
  if (!pass) {
    return changePassErrorText('Bitte Passwort eingeben')
  }
  // reset existing token
  store.set(setLoginAtom, {
    username: '',
    token: '',
  })
  // now acquire new token
  // ae.login returns { token, role, username, exp }
  let res
  try {
    res = await rpc('login', { username: name, pass })
  } catch (error) {
    const isNamePassError =
      error.message === 'invalid user or password' ||
      error.message === 'permission denied for relation user'
    if (isNamePassError) {
      const message = 'Name oder Passwort nicht bekannt'
      changeNameErrorText(message)
      return changePassErrorText(message)
    }
    return console.error(error)
  }
  const jwtToken = res?.token
  if (jwtToken) {
    const { username } = res
    // set login state
    try {
      store.set(setLoginAtom, {
        username,
        token: jwtToken,
      })
      // Invalidate tree query to refetch with new token
      await queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
    } catch (error) {
      console.error(error)
    }
    changeNameErrorText(null)
    changePassErrorText(null)
    changeLoginSuccessfull(true)
    setTimeout(() => {
      changeName('')
      changePass('')
      changeLoginSuccessfull(false)
      navigate('/')
    }, 2000)
  }
}
