import { gql } from '@apollo/client'

export const createOrgUserMutation = gql`
  mutation createOrganizationUser($organizationId: UUID!) {
    createOrganizationUser(
      input: { organizationUser: { organizationId: $organizationId } }
    ) {
      organizationUser {
        organizationId
      }
    }
  }
`
