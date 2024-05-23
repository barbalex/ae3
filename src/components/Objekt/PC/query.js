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
    }
    objectById(id: $objId) {
      id
      taxonomyId
      parentId
      name
      properties
      idOld
      propertyCollectionObjectsByObjectId {
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
      relationsByObjectId {
        totalCount
        nodes {
          id
          propertyCollectionId
          objectId
          objectIdRelation
          relationType
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
          objectByObjectIdRelation {
            id
            name
            taxonomyByTaxonomyId {
              id
              name
              type
            }
          }
        }
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
`
