import { gql } from '@apollo/client'

export const treeQuery = gql`
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
