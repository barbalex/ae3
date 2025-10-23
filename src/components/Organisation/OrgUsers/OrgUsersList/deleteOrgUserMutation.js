import { gql } from '@apollo/client'

export const deleteOrgUserMutation = gql`
  mutation deleteOrganizationUser($id: UUID!) {
    deleteOrganizationUserById(input: { id: $id }) {
      organizationUser {
        id
      }
    }
  }
`
