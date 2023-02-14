import isUuid from 'is-uuid'

const getLastIdFromUrl = (url) => {
  if (!url) return undefined
  if (url.length === 0) return undefined
  const last = url.at(-1)
  console.log('getLastIdFromUrl, last:', last)
  if (isUuid.anyNonNil(last)) {
    return last
  }
  return getLastIdFromUrl(url.slice(0, -1))
}

export default getLastIdFromUrl
