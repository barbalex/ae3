import { apiFetch } from './api'

export const collectionExportPageSize = 500

export const collectionOrder = (
  orderBy: string,
  direction: string | null | undefined,
  columns: Record<string, string>,
): string => {
  const field = columns[orderBy] ?? `properties->${orderBy}`
  const sortDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc'
  return `${field}.${sortDirection},id.asc`
}

export const collectionSortDirection = (
  orderBy: string,
  direction: string | null | undefined,
  propertyKeys: string[],
  rows: any[],
): string | null | undefined => {
  if (!propertyKeys.includes(orderBy)) return direction
  const sample = rows
    .map((row) => row.properties?.[orderBy])
    .find((value) => value !== null && value !== undefined)
  if (typeof sample !== 'boolean') return direction
  return direction?.toLowerCase() === 'desc' ? 'asc' : 'desc'
}

export const fetchCollectionPages = async function* (
  path: string,
  {
    pageSize = collectionExportPageSize,
    totalCount = Infinity,
  }: { pageSize?: number; totalCount?: number } = {},
): AsyncGenerator<any[]> {
  const [resource, query = ''] = path.split('?')
  const params = new URLSearchParams(query)

  for (let offset = 0; offset < totalCount; offset += pageSize) {
    params.set('limit', String(pageSize))
    params.set('offset', String(offset))
    const page = await apiFetch(`${resource}?${params}`)
    if (!page?.length) return

    yield page
    if (page.length < pageSize) return
  }
}
