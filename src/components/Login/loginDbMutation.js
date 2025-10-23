import { gql } from '@apollo/client'

export const loginDbMutation = gql`
  mutation logIn($username: String, $pass: String) {
    login(input: { username: $username, pass: $pass }) {
      clientMutationId
      jwtToken
    }
  }
`
