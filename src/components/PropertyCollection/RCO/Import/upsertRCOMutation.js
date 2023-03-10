import { gql } from '@apollo/client'

export default gql`
  mutation upsertRCO(
    $objectId: UUID!
    $objectIdRelation: UUID!
    $propertyCollectionId: UUID!
    $propertyCollectionOfOrigin: UUID
    $relationType: String!
    $properties: JSON
  ) {
    upsertRelation(
      where: {
        objectId: $objectId
        objectIdRelation: $objectIdRelation
        propertyCollectionId: $propertyCollectionId
      }
      input: {
        relation: {
          objectId: $objectId
          objectIdRelation: $objectIdRelation
          propertyCollectionId: $propertyCollectionId
          propertyCollectionOfOrigin: $propertyCollectionOfOrigin
          relationType: $relationType
          properties: $properties
        }
      }
    ) {
      relation {
        id
        objectId
        objectIdRelation
        propertyCollectionId
        propertyCollectionOfOrigin
        relationType
        properties
      }
    }
  }
`
