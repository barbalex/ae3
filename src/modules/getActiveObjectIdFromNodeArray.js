export const getActiveObjectIdFromNodeArray = (activeNodeArray) => {
  let activeObjectId = null
  if (
    activeNodeArray.length > 2 &&
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0])
  ) {
    activeObjectId = activeNodeArray[activeNodeArray.length - 1]
  }
  return activeObjectId
}
