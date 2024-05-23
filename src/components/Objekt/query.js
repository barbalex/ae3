import { gql } from '@apollo/client'

export default gql`
  query ObjectQuery($objectId: UUID!) {
    objectById(id: $objectId) {
      id
      taxonomyId
      parentId
      name
      properties
      idOld
      synonymsByObjectId {
        totalCount
        nodes {
          nodeId
          objectId
          objectIdSynonym
          objectByObjectIdSynonym {
            id
            taxonomyId
            parentId
            name
            properties
            idOld
            taxonomyByTaxonomyId {
              id
              name
              type
              description
              links
              lastUpdated
              importedBy
              termsOfUse
              habitatLabel
              habitatComments
              habitatNrFnsMin
              habitatNrFnsMax
              organizationByOrganizationId {
                id
                name
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
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      taxonomyByTaxonomyId {
        id
        name
        type
        description
        links
        lastUpdated
        importedBy
        termsOfUse
        habitatLabel
        habitatComments
        habitatNrFnsMin
        habitatNrFnsMax
        organizationByOrganizationId {
          id
          name
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
    pcs: allPropertyCollections(
      filter: {
        or: [
          {
            relationsByPropertyCollectionId: {
              some: { objectId: { equalTo: $objectId } }
            }
          }
          {
            propertyCollectionObjectsByPropertyCollectionId: {
              some: { objectId: { equalTo: $objectId } }
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
