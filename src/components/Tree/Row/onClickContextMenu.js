import { apiFetch } from '../../../modules/api.js'
import { store, queryClientAtom } from '../../../store/index.ts'
import { editingTaxonomiesAtom, editingPCsAtom } from '../../../store/index.ts'

// graphql used the enum values, PostgREST the enum labels
const taxonomyTypeConverter = {
  Arten: 'Art',
  Lebensraeume: 'Lebensraum',
}

export const onClickContextMenu = async ({
  data,
  id,
  url,
  scrollIntoView,
  loginUsername,
  navigate,
}) => {
  const queryClient = store.get(queryClientAtom)
  const editingTaxonomies = store.get(editingTaxonomiesAtom)

  if (!queryClient) {
    console.error('Query client not initialized')
    return
  }
  if (!data) return console.log('no data passed with click')
  const { table, action } = data

  const actions = {
    insert: async () => {
      if (table === 'user') {
        // ids are generated client-side: rls hides the new row from
        // being returned (it has no name yet)
        const newUserId = crypto.randomUUID()
        try {
          await apiFetch('/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ id: newUserId }]),
          })
          navigate(`/Benutzer/${newUserId}`)
        } catch (error) {
          console.log(error)
        }
      }
      // get userId
      const users = await apiFetch(
        `/user?select=id&name=eq.${encodeURIComponent(loginUsername)}`,
      )
      const userId = users?.[0]?.id
      if (table === 'object') {
        const newId = crypto.randomUUID()
        await apiFetch('/object', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            url.length === 2 ?
              // user clicked on the taxonomy:
              // create root level object, without parentId
              { id: newId, taxonomy_id: url[1] }
            : { id: newId, taxonomy_id: url[1], parent_id: id },
          ]),
        })
        navigate(`/${[...url, newId].join('/')}`)
        // if not editing, set editing true
        if (!editingTaxonomies) {
          store.set(editingTaxonomiesAtom, true)
        }
      }
      if (table === 'taxonomy') {
        const type = taxonomyTypeConverter[id] ?? 'Art'
        const newId = crypto.randomUUID()
        await apiFetch('/taxonomy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            {
              id: newId,
              type,
              imported_by: userId,
              last_updated: new Date(),
            },
          ]),
        })
        navigate(`/${[...url, newId].join('/')}`)
        // if not editingTaxonomies, set editingTaxonomies true
        if (!editingTaxonomies) {
          store.set(editingTaxonomiesAtom, true)
        }
      }
      if (table === 'pc') {
        const newId = crypto.randomUUID()
        await apiFetch('/property_collection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            {
              id: newId,
              imported_by: userId,
              last_updated: new Date(),
            },
          ]),
        })
        navigate(`/${[...url, newId].join('/')}`)
        // if not editing, set editing true
        if (!editingTaxonomies) {
          store.set(editingPCsAtom, true)
        }
      }
      queryClient.invalidateQueries({
        queryKey: [`tree`],
      })
      setTimeout(() => scrollIntoView())
    },
    delete: async () => {
      const tableNames = {
        user: '/user',
        object: '/object',
        taxonomy: '/taxonomy',
        pc: '/property_collection',
      }
      const path = tableNames[table]
      if (!path) {
        return console.log(`table "${table}" unknown, therefore not deleted`)
      }
      try {
        await apiFetch(`${path}?id=eq.${id}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.log(error)
      }
      queryClient.invalidateQueries({
        queryKey: [`tree`],
      })
      if (url.includes(id)) {
        url.length = url.indexOf(id)
        navigate(`/${url.join('/')}`)
      }
      queryClient.invalidateQueries({
        queryKey: [`tree`],
      })
      setTimeout(() => scrollIntoView())
    },
  }
  if (Object.keys(actions).includes(action)) {
    actions[action]()
  } else {
    console.log(`action "${action}" unknown, therefore not executed`)
  }
}
