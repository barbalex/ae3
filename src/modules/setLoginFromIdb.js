export const setLoginFromIdb = async ({ idb, setLogin }) => {
  const users = await idb.users.toArray()
  const token = users?.[0]?.token
  const username = users?.[0]?.username
  if (username && token) {
    setLogin({ username, token })
    return
  }
  return
}
