import { jotaiStore, setLoginAtom } from '../jotaiStore/index.ts'

export const setLoginFromIdb = async ({ idb, store }) => {
  const users = await idb.users.toArray()
  const token = users?.[0]?.token
  const username = users?.[0]?.username
  if (username && token) {
    jotaiStore.set(setLoginAtom, { username, token })
    return store
  }
  return store
}
