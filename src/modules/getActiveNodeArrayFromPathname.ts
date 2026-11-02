export const getActiveNodeArrayFromPathname = (): (string | number)[] => {
  let pathName =
    typeof window !== 'undefined'
      ? window.location.pathname.replace('/', '')
      : ''
  // need to remove trailing /
  // would result in 0 added to activeNodeArray
  if (pathName.endsWith('/')) {
    pathName = pathName.slice(0, -1)
  }
  let pathElements: (string | number)[] = pathName.split('/')
  if (pathElements[0] === '') {
    // get rid of empty element(s) at start
    pathElements.shift()
  }
  // decode elements
  pathElements = pathElements.map((e) => decodeURIComponent(e as string))
  // convert numbers to numbers
  //stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
  pathElements.forEach((e, index) => {
    if (!isNaN(e as number)) {
      pathElements[index] = +e
    }
  })

  return pathElements
}
