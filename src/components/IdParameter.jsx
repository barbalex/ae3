import { useContext, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import isUuid from 'is-uuid'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'

import { getUrlForObject } from '../modules/getUrlForObject.js'
import { getUrlParamByName } from '../modules/getUrlParamByName.js'
import { storeContext } from '../storeContext.js'

const objectQuery = gql`
  query ObjectQuery($id: UUID!, $hasObjectId: Boolean!) {
    objectById(id: $id) @include(if: $hasObjectId) {
      id
      taxonomyByTaxonomyId {
        id
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
`

const IdParameter = observer(() => {
  const store = useContext(storeContext)
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  /**
   * check if old url was passed that contains objectId-Param
   * for instance:
   * /?id=AD0B10AA-707D-42C6-B68D-8F88CCD2F0B3
   */
  const idParam = getUrlParamByName('id')
  const objectId =
    idParam && isUuid.anyNonNil(idParam) ? idParam.toLowerCase() : null

  const hasObjectId = !!objectId
  const { error, data } = useQuery({
    queryKey: ['object', objectId],
    queryFn: () =>
      apolloClient.query({
        query: objectQuery,
        variables: { id: objectId, hasObjectId },
        fetchPolicy: 'no-cache',
      }),
    enabled: hasObjectId,
  })

  useEffect(() => {
    if (hasObjectId && data?.data?.objectById) {
      if (error) return null
      // if idParam was passed, open object
      const url = getUrlForObject(data?.data?.objectById)
      navigate(`/${url.join('/')}`)
      setTimeout(() => store.scrollIntoView())
      // remove id param from url. Nope, not needed
    }
  }, [data?.data?.objectById, error, hasObjectId, navigate, store])
  return null
})

export default IdParameter
