import { rpc } from './api.js'

/**
 * link parent ids as nested objectByParentId, like the former
 * recursive graphql queries did (getUrlForObject walks it).
 * parentIds: from the object's direct parent up to the root
 */
export const attachParentIds = (object, parentIds) => {
  let node = object
  for (const id of parentIds) {
    node.objectByParentId = { id }
    node = node.objectByParentId
  }
  return object
}

/**
 * attach the chain of ancestor ids via a single rpc (one request,
 * formerly one request per parent level). ae.object_path returns the
 * ids root-first, the object itself last
 */
export const attachParentChain = async (object) => {
  if (!object?.id) return object
  const path = await rpc('object_path', { p_object_id: object.id })
  const rootFirst = path.map((row) => row.object_id)
  return attachParentIds(object, rootFirst.slice(0, -1).reverse())
}
