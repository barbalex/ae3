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
        let newUser
        try {
          newUser = await apiFetch('/user?select=id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{}]),
          })
        } catch (error) {
          console.log(error)
        }
        const newUserId = newUser?.[0]?.id
        if (newUserId) {
          navigate(`/Benutzer/${newUserId}`)
        }
      }
      // get userId
      const users = await apiFetch(
        `/user?select=id&name=eq.${encodeURIComponent(loginUsername)}`,
      )
      const userId = users?.[0]?.id
      if (table === 'object') {
        let newObjectData
        if (url.length === 2) {
          // user clicked on the taxonomy
          // need to create root level object, without parentId
          newObjectData = await apiFetch('/object?select=id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ taxonomy_id: url[1] }]),
          })
        } else {
          newObjectData = await apiFetch('/object?select=id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ taxonomy_id: url[1], parent_id: id }]),
          })
        }
        const newId = newObjectData?.[0]?.id ?? null
        navigate(`/${[...url, newId].join('/')}`)
        // if not editing, set editing true
        if (!editingTaxonomies) {
          store.set(editingTaxonomiesAtom, true)
        }
      }
      if (table === 'taxonomy') {
        const type = taxonomyTypeConverter[id] ?? 'Art'
        const newTaxonomyData = await apiFetch('/taxonomy?select=id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            {
              type,
              imported_by: userId,
              last_updated: new Date(),
            },
          ]),
        })
        const newId = newTaxonomyData?.[0]?.id ?? null
        navigate(`/${[...url, newId].join('/')}`)
        // if not editingTaxonomies, set editingTaxonomies true
        if (!editingTaxonomies) {
          store.set(editingTaxonomiesAtom, true)
        }
      }
      if (table === 'pc') {
        const newPCData = await apiFetch('/property_collection?select=id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            {
              imported_by: userId,
              last_updated: new Date(),
            },
          ]),
        })
        const newId = newPCData?.[0]?.id ?? null
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
