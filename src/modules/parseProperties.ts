// jsonb columns arrive as parsed objects from PostgREST
// (they arrived as strings from PostGraphile), so only parse strings
export const parseProperties = (
  properties: Record<string, any> | string | null | undefined,
): Record<string, any> => {
  if (properties === null || properties === undefined) return {}
  if (typeof properties === 'string') {
    try {
      return JSON.parse(properties)
    } catch {
      return {}
    }
  }
  return properties
}
