import isUuid from 'is-uuid'

export const getLastIdFromUrl = (
  url?: (string | number)[],
): string | undefined => {
  if (!url) return undefined
  if (url.length === 0) return undefined
  const last = url.at(-1)
  if (isUuid.anyNonNil(last as string)) {
    return last as string
  }
  return getLastIdFromUrl(url.slice(0, -1))
}
