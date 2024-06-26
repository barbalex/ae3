import { gql } from '@apollo/client'

export default gql`
  query ObjectQuery($objectIds: [UUID!]) {
    pcs: allPropertyCollections(
      filter: {
        or: [
          {
            relationsByPropertyCollectionId: {
              some: { objectId: { in: $objectIds } }
            }
          }
          {
            propertyCollectionObjectsByPropertyCollectionId: {
              some: { objectId: { in: $objectIds } }
            }
          }
        ]
      }
      orderBy: NAME_ASC
    ) {
      totalCount
      nodes {
        id
        name
      }
    }
  }
`
