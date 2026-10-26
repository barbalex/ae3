import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import isUuid from 'is-uuid'
import { useNavigate } from 'react-router'
import { useSetAtom } from 'jotai'

import { getUrlForObject } from '../modules/getUrlForObject.js'
import { getUrlParamByName } from '../modules/getUrlParamByName.js'
import { apiFetch } from '../modules/api.js'
import { attachParentChain } from '../modules/attachParentChain.js'
import { scrollIntoViewAtom } from '../store/index.ts'

const IdParameter = () => {
  const navigate = useNavigate()
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)
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
    queryFn: async () => {
      const objects = await apiFetch(
        `/object?id=eq.${objectId}&select=id,parentId:parent_id,taxonomyByTaxonomyId:taxonomy_id(id,type)`,
      )
      const objekt = objects?.[0]
      if (!objekt) return null
      // attach ancestor chain for url building (formerly recursive graphql)
      await attachParentChain(objekt)
      return objekt
    },
    enabled: hasObjectId,
  })

  useEffect(() => {
    if (hasObjectId && data) {
      if (error) return null
      // if idParam was passed, open object
      const url = getUrlForObject(data)
      navigate(`/${url.join('/')}`)
      setTimeout(() => scrollIntoView())
      // remove id param from url. Nope, not needed
    }
  }, [data, error, hasObjectId, navigate, scrollIntoView])
  return null
}

export default IdParameter
