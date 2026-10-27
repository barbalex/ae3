import { apiFetch } from './api.js'

/**
 * attach the chain of ancestor ids as objectByParentId,
 * like the former recursive graphql queries did
 * (getUrlForObject walks it)
 */
export const attachParentChain = async (object) => {
  let node = object
  let parentId = object.parentId
  while (parentId) {
    const parent = (
      await apiFetch(
        `/object?id=eq.${parentId}&select=id,parentId:parent_id&limit=1`,
      )
    )?.[0]
    if (!parent) break
    node.objectByParentId = { id: parent.id }
    node = node.objectByParentId
    parentId = parent.parentId
  }
  return object
}
