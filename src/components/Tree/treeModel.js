import { apiCount, apiFetch } from '../../modules/api.js'
import { isUrlInActiveNodePath } from '../../modules/isUrlInActiveNodePath.js'

// tree lists are fetched page-wise: this bounds response sizes of
// potentially huge levels (e.g. all objects of a taxonomy); further
// pages are appended on demand via fetchMoreTreeRows
export const treePageSize = 500

export const rootCountsQuery = (hasToken) => ({
  queryKey: ['tree', 'root', hasToken],
  queryFn: async () => {
    const [arten, lebensraeume, pcs, users, organizations] = await Promise.all([
      apiCount('/taxonomy?type=eq.Art'),
      apiCount('/taxonomy?type=eq.Lebensraum'),
      apiCount('/property_collection'),
      ...(hasToken ?
        [apiCount('/user'), apiCount('/organization')]
      : [Promise.resolve(0), Promise.resolve(0)]),
    ])
    return { arten, lebensraeume, pcs, users, organizations }
  },
})

// cached list values are { rows, complete, loading }: rows accumulate
// across pages, complete marks the end of the list, loading is set
// while a further page is being fetched (click on the "more" row)
const makeListQuery = (queryKey, path) => ({
  queryKey,
  // a refetch (e.g. after a mutation invalidated ['tree']) fetches at
  // least as many rows as were loaded before, so loaded pages survive.
  // The query client is passed in the context as `client`
  queryFn: async ({ queryKey, client }) => {
    const cachedRows = client.getQueryData(queryKey)?.rows?.length ?? 0
    const limit = Math.max(treePageSize, cachedRows)
    const rows = await apiFetch(`${path}&limit=${limit}`)
    return { rows, complete: rows.length < limit, loading: false }
  },
  path,
})

const listDefs = {
  taxonomies: (type) =>
    makeListQuery(
      ['tree', 'lrTax', type],
      `/taxonomy?select=id,name,objectCount:object(count)&type=eq.${
        type === 'Lebensräume' ? 'Lebensraum' : 'Art'
      }&object.parent_id=is.null&order=name`,
    ),
  topLevelObjects: (taxId) =>
    makeListQuery(
      ['tree', 'lr', taxId],
      `/object?taxonomy_id=eq.${taxId}&parent_id=is.null&select=id,name,objectCount:object!parent_id(count)&order=name`,
    ),
  objectChildren: (id) =>
    makeListQuery(
      ['tree', 'lrObject', id],
      `/object?parent_id=eq.${id}&select=id,name,objectCount:object!parent_id(count)&order=name`,
    ),
  pcs: () =>
    makeListQuery(
      ['tree', 'pcs'],
      '/property_collection?select=id,name,pcoCount:property_collection_object!property_collection_object_property_collection_id_fkey(count),relCount:relation!relation_property_collection_id_fkey(count)&order=name',
    ),
  users: () => makeListQuery(['tree', 'users'], '/user?select=id,name&order=name'),
  organizations: () =>
    makeListQuery(['tree', 'orgs'], '/organization?select=id,name&order=name'),
}

const defFromKey = ([, kind, id]) => {
  switch (kind) {
    case 'lrTax':
      return listDefs.taxonomies(id)
    case 'lr':
      return listDefs.topLevelObjects(id)
    case 'lrObject':
      return listDefs.objectChildren(id)
    case 'pcs':
      return listDefs.pcs()
    case 'users':
      return listDefs.users()
    case 'orgs':
      return listDefs.organizations()
  }
}

/**
 * Fetch the next page of a list and append it to the cached value.
 * The offset is the number of already cached rows; appended rows are
 * deduped by id to survive concurrent refetches.
 */
export const fetchMoreTreeRows = async (queryClient, queryKey) => {
  const current = queryClient.getQueryData(queryKey)
  if (!current || current.loading) return
  const { path } = defFromKey(queryKey)
  queryClient.setQueryData(queryKey, { ...current, loading: true })
  try {
    const offset = current.rows.length
    const next = await apiFetch(
      `${path}&limit=${treePageSize}&offset=${offset}`,
    )
    queryClient.setQueryData(queryKey, (latest) => {
      const ids = new Set(latest.rows.map((row) => row.id))
      return {
        rows: [...latest.rows, ...next.filter((row) => !ids.has(row.id))],
        complete: next.length < treePageSize,
        loading: false,
      }
    })
  } catch (error) {
    queryClient.setQueryData(queryKey, (latest) => ({
      ...latest,
      loading: false,
    }))
    throw error
  }
}

/**
 * Build the flat, depth-first list of visible tree rows from the
 * query cache. Which levels are visible derives from activeNodeArray
 * (the url), like the former nested components did.
 *
 * Returns { rows, queries, pathHoles }:
 * - rows: { type: 'row', data } | { type: 'loading', level } |
 *   { type: 'more', queryKey, level, loading }
 * - queries: every query read during the walk; subscribing to them
 *   (useQueries) keeps the flat model updating when they resolve or
 *   are invalidated
 * - pathHoles: list query keys where the url expects a child that
 *   the loaded pages do not contain; fetching further pages of
 *   these lists lets deep links expand through big levels
 */
export const buildTreeRows = ({ activeNodeArray, hasToken, getQueryData }) => {
  const rows = []
  const queries = new Map()
  const pathHoles = []

  const read = (def) => {
    const key = def.queryKey.join('/')
    if (!queries.has(key)) queries.set(key, def)
    return getQueryData(def.queryKey)
  }

  // render one fetched list level below folderUrl; loading/more rows
  // stand in for pending or truncated lists. Children of a row
  // follow it directly
  const pushList = ({ def, folderUrl, buildRow, onOpen }) => {
    const level = folderUrl.length + 1
    const cached = read(def)
    if (cached === undefined) {
      rows.push({ type: 'loading', level })
      return
    }
    for (const apiRow of cached.rows ?? []) {
      const data = buildRow(apiRow)
      rows.push({ type: 'row', data })
      onOpen?.(data, apiRow)
    }
    if (!cached.complete) {
      rows.push({ type: 'more', queryKey: def.queryKey, level, loading: cached.loading })
      // the url points to a child of this folder that the loaded
      // pages do not contain: a later page is needed to expand
      // further (deep links into big levels)
      if (isUrlInActiveNodePath(folderUrl, activeNodeArray)) {
        const expectedId = activeNodeArray[folderUrl.length]
        const found = (cached.rows ?? []).some((row) => row.id === expectedId)
        if (expectedId !== undefined && !found) {
          pathHoles.push(def.queryKey)
        }
      }
    }
  }

  const objectChildrenCount = (apiRow) =>
    apiRow.objectCount?.[0]?.count ?? 0

  // an object is expanded when its url is a prefix of the active url
  // and it has children (former Object.jsx/TopLevelObject.jsx)
  const pushObjectDescendants = (node) => {
    if (!(node.childrenCount > 0)) return
    if (!isUrlInActiveNodePath(node.url, activeNodeArray)) return
    pushList({
      def: listDefs.objectChildren(node.id),
      folderUrl: node.url,
      buildRow: (apiRow) => ({
        label: apiRow.name ?? apiRow.id,
        id: apiRow.id,
        url: [...node.url, apiRow.id],
        childrenCount: objectChildrenCount(apiRow),
        info: objectChildrenCount(apiRow),
        menuType: 'CmObject',
      }),
      onOpen: pushObjectDescendants,
    })
  }

  const pushTaxonomyLevel = (type) => {
    pushList({
      def: listDefs.taxonomies(type),
      folderUrl: [type],
      buildRow: (apiRow) => ({
        label: apiRow.name ?? apiRow.id,
        id: apiRow.id,
        url: [type, apiRow.id],
        childrenCount: objectChildrenCount(apiRow),
        info: objectChildrenCount(apiRow),
        menuType: 'CmTaxonomy',
      }),
      onOpen: (taxRow) => {
        // former Tax.jsx: taxonomies expand without a count check
        if (!isUrlInActiveNodePath(taxRow.url, activeNodeArray)) return
        pushList({
          def: listDefs.topLevelObjects(taxRow.id),
          folderUrl: taxRow.url,
          buildRow: (apiRow) => ({
            label: apiRow.name ?? apiRow.id,
            id: apiRow.id,
            url: [type, taxRow.id, apiRow.id],
            childrenCount: objectChildrenCount(apiRow),
            info: objectChildrenCount(apiRow),
            menuType: 'CmObject',
          }),
          onOpen: pushObjectDescendants,
        })
      },
    })
  }

  const pushPcLevel = () => {
    pushList({
      def: listDefs.pcs(),
      folderUrl: ['Eigenschaften-Sammlungen'],
      buildRow: (apiRow) => {
        const pcoCount = apiRow.pcoCount?.[0]?.count ?? 0
        const relCount = apiRow.relCount?.[0]?.count ?? 0
        return {
          label: apiRow.name ?? apiRow.id,
          id: apiRow.id,
          url: ['Eigenschaften-Sammlungen', apiRow.id],
          childrenCount: 2,
          info: pcoCount + relCount,
          menuType: 'CmPC',
        }
      },
      onOpen: (pcRow, apiRow) => {
        if (!isUrlInActiveNodePath(pcRow.url, activeNodeArray)) return
        const pcoCount = apiRow.pcoCount?.[0]?.count ?? 0
        const relCount = apiRow.relCount?.[0]?.count ?? 0
        // former Folders.jsx: two static rows below an active pc
        rows.push({
          type: 'row',
          data: {
            label: 'Eigenschaften',
            id: `${pcRow.id}/Eigenschaften`,
            url: [...pcRow.url, 'Eigenschaften'],
            childrenCount: 0,
            info: pcoCount,
            menuType: 'pCProperties',
          },
        })
        rows.push({
          type: 'row',
          data: {
            label: 'Beziehungen',
            id: `${pcRow.id}/Beziehungen`,
            url: [...pcRow.url, 'Beziehungen'],
            childrenCount: 0,
            info: relCount,
            menuType: 'pCRelations',
          },
        })
      },
    })
  }

  const pushSimpleLevel = ({ def, urlBase, menuType }) =>
    pushList({
      def,
      folderUrl: [urlBase],
      buildRow: (apiRow) => ({
        label: apiRow.name ?? apiRow.id,
        id: apiRow.id,
        url: [urlBase, apiRow.id],
        childrenCount: 0,
        info: undefined,
        menuType,
      }),
    })

  const counts = read(rootCountsQuery(hasToken))
  if (counts === undefined) {
    rows.push({ type: 'loading', level: 1 })
    return { rows, queries: [...queries.values()], pathHoles }
  }

  const rootRows = [
    {
      data: {
        label: 'Arten',
        id: 'Arten',
        url: ['Arten'],
        childrenCount: counts.arten,
        info: `${counts.arten} Taxonomien`,
        menuType: 'CmType',
      },
      onOpen: () => pushTaxonomyLevel('Arten'),
    },
    {
      data: {
        label: 'Lebensräume',
        id: 'Lebensraeume',
        url: ['Lebensräume'],
        childrenCount: counts.lebensraeume,
        info: `${counts.lebensraeume} Taxonomien`,
        menuType: 'CmType',
      },
      onOpen: () => pushTaxonomyLevel('Lebensräume'),
    },
    {
      data: {
        label: 'Eigenschaften-Sammlungen',
        id: 'Eigenschaften-Sammlungen',
        url: ['Eigenschaften-Sammlungen'],
        childrenCount: counts.pcs,
        info: counts.pcs,
        menuType: 'CmPCFolder',
      },
      onOpen: pushPcLevel,
    },
    ...(hasToken ?
      [
        {
          data: {
            label: 'Benutzer',
            id: 'BenutzerFolder',
            url: ['Benutzer'],
            childrenCount: counts.users,
            info: counts.users,
            menuType: 'CmBenutzerFolder',
          },
          onOpen: () =>
            pushSimpleLevel({
              def: listDefs.users(),
              urlBase: 'Benutzer',
              menuType: 'CmBenutzer',
            }),
        },
        {
          data: {
            label: 'Organisationen',
            id: 'OrganisationenFolder',
            url: ['Organisationen'],
            childrenCount: counts.organizations,
            info: counts.organizations,
            menuType: 'orgFolder',
          },
          onOpen: () =>
            pushSimpleLevel({
              def: listDefs.organizations(),
              urlBase: 'Organisationen',
              menuType: 'organization',
            }),
        },
      ]
    : []),
  ]

  for (const { data, onOpen } of rootRows) {
    rows.push({ type: 'row', data })
    if (isUrlInActiveNodePath(data.url, activeNodeArray)) onOpen()
  }

  return { rows, queries: [...queries.values()], pathHoles }
}
