import { gql } from '@apollo/client'

export default gql`
  query TreeDataQuery($username: String!) {
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
