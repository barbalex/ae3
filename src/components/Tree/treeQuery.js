import { gql } from '@apollo/client'

export default gql`
  query TreeQuery($username: String!) {
    userByName(name: $username) {
      id
      organizationUsersByUserId {
        nodes {
          id
          role
        }
      }
    }
  }
`
