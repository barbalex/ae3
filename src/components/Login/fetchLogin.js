import { jwtDecode } from 'jwt-decode'
import { CombinedGraphQLErrors } from '@apollo/client'

import { loginDbMutation } from './loginDbMutation.js'
import { store, setLoginAtom, apolloClientAtom, queryClientAtom } from '../../store/index.ts'

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
}) => {
  const client = store.get(apolloClientAtom)
  const queryClient = store.get(queryClientAtom)
  
  if (!client || !queryClient) {
    console.error('Apollo client or Query client not initialized')
    return
  }
  
  // when blurring fields need to pass event value
  // on the other hand when clicking on Anmelden button,
  // need to grab props
  const name = namePassed || propsName || nameInput.current.value
  const pass = passPassed || propsPass || passwordInput.current.value
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
  const { data, error } = await client.mutate({
    mutation: loginDbMutation,
    variables: {
      username: name,
      pass,
    },
  })

  if (CombinedGraphQLErrors.is(error)) {
    const messages = error.errors.map((x) => x.message)
    const isNamePassError =
      messages.includes('invalid user or password') ||
      messages.includes('permission denied for relation user')
    if (isNamePassError) {
      const message = 'Name oder Passwort nicht bekannt'
      changeNameErrorText(message)
      return changePassErrorText(message)
    }
    return console.log(error)
  }
  const jwtToken = data?.login?.jwtToken
  if (jwtToken) {
    const tokenDecoded = jwtDecode(jwtToken)
    const { username } = tokenDecoded
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
      console.log(('Error during mutation', error))
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
