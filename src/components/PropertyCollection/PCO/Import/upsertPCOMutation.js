import { gql } from '@apollo/client'

export const upsertPCOMutation = gql`
  mutation upsertPCO(
    $id: UUID
    $objectId: UUID
    $propertyCollectionId: UUID
    $propertyCollectionOfOrigin: UUID
    $properties: JSON
  ) {
    upsertPropertyCollectionObject(
      where: {
        objectId: $objectId
        propertyCollectionId: $propertyCollectionId
      }
      input: {
        propertyCollectionObject: {
          id: $id
          objectId: $objectId
          propertyCollectionId: $propertyCollectionId
          propertyCollectionOfOrigin: $propertyCollectionOfOrigin
          properties: $properties
        }
      }
    ) {
      propertyCollectionObject {
        id
        objectId
        propertyCollectionId
        propertyCollectionOfOrigin
        properties
      }
    }
  }
`
