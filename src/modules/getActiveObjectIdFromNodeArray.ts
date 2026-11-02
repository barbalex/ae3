export const getActiveObjectIdFromNodeArray = (
  activeNodeArray: (string | number)[],
): string | number | null => {
  let activeObjectId: string | number | null = null
  if (
    activeNodeArray.length > 2 &&
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0] as string)
  ) {
    activeObjectId = activeNodeArray[activeNodeArray.length - 1]
  }
  return activeObjectId
}
