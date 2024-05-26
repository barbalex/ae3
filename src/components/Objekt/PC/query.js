import { gql } from '@apollo/client'

export default gql`
  query ObjectQuery($objId: UUID!, $pcId: UUID!) {
    propertyCollectionById(id: $pcId) {
      id
      name
      description
      links
      combining
      lastUpdated
      termsOfUse
      importedBy
      organizationByOrganizationId {
        id
        name
      }
      userByImportedBy {
        id
        name
        email
      }
      propertyCollectionObjectsByPropertyCollectionId(
        filter: { objectId: { equalTo: $objId } }
      ) {
        totalCount
        nodes {
          id
          objectId
          propertyCollectionId
          propertyCollectionOfOrigin
          properties
          propertyCollectionByPropertyCollectionId {
            id
            name
            description
            links
            combining
            lastUpdated
            termsOfUse
            importedBy
            organizationByOrganizationId {
              id
              name
            }
            userByImportedBy {
              id
              name
              email
            }
          }
        }
      }
      relationsByPropertyCollectionId(
        filter: { objectId: { equalTo: $objId } }
      ) {
        totalCount
        nodes {
          id
          propertyCollectionId
          objectId
          objectIdRelation
          relationType
          properties
          objectByObjectIdRelation {
            id
            name
            taxonomyByTaxonomyId {
              id
              name
              type
            }
            objectByParentId {
              id
              objectByParentId {
                id
                objectByParentId {
                  id
                  objectByParentId {
                    id
                    objectByParentId {
                      id
                      objectByParentId {
                        id
                        objectByParentId {
                          id
                          objectByParentId {
                            id
                            objectByParentId {
                              id
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
