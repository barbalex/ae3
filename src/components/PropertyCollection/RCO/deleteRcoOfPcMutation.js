import { gql } from '@apollo/client'

export const deleteRcoOfPcMutation = gql`
  mutation deleteRcoOfPc($pcId: UUID!) {
    deleteRcoOfPc(input: { pcId: $pcId }) {
      taxonomies {
        id
      }
    }
  }
`
