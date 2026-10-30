import { apiFetch } from './api.js'

export const collectionExportPageSize = 500

export const collectionOrder = (
  orderBy,
  direction,
  columns,
) => {
  const field = columns[orderBy] ?? `properties->${orderBy}`
  const sortDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc'
  return `${field}.${sortDirection},id.asc`
}

export const collectionSortDirection = (
  orderBy,
  direction,
  propertyKeys,
  rows,
) => {
  if (!propertyKeys.includes(orderBy)) return direction
  const sample = rows
    .map((row) => row.properties?.[orderBy])
    .find((value) => value !== null && value !== undefined)
  if (typeof sample !== 'boolean') return direction
  return direction?.toLowerCase() === 'desc' ? 'asc' : 'desc'
}

export const fetchCollectionPages = async function* (
  path,
  { pageSize = collectionExportPageSize, totalCount = Infinity } = {},
) {
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