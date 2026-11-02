import { isEqual } from 'es-toolkit'

export const isUrlInActiveNodePath = (
  url: (string | number)[] | null | undefined,
  activeNodeArray: (string | number)[] | null | undefined,
): boolean => {
  if (!url) return false
  if (!activeNodeArray) return false
  const activeNodeArrayPartWithEqualLength = activeNodeArray.slice(
    0,
    url.length,
  )
  return isEqual(activeNodeArrayPartWithEqualLength, url)
}
