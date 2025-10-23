import { gql } from '@apollo/client'

export const deletePcoOfPcMutation = gql`
  mutation deletePcoOfPc($pcId: UUID!) {
    deletePcoOfPc(input: { pcId: $pcId }) {
      taxonomies {
        id
      }
    }
  }
`
