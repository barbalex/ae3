import { gql } from '@apollo/client'

export const updateUserMutation = gql`
  mutation updateUser($username: String, $email: String, $id: UUID!) {
    updateUserById(
      input: { id: $id, userPatch: { name: $username, email: $email } }
    ) {
      user {
        id
      }
    }
  }
`
