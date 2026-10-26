import { jwtDecode } from 'jwt-decode'

import { store, loginTokenAtom, setLoginAtom } from '../store/index.ts'

export const postgrestUri = () => {
  const hostnameWithoutWww =
    typeof window !== 'undefined' ?
      window.location.hostname.replace('www.', '')
    : ''
  if (hostnameWithoutWww === 'localhost') return 'http://localhost:3000'

  return `https://api.${hostnameWithoutWww}/postgrest`
}

// headers with the login token attached; expires the token like the
// former apollo auth link did
const authHeaders = async () => {
  const headers = new Headers()
  const token = store.get(loginTokenAtom)
  if (token) {
    try {
      const { exp } = jwtDecode(token)
      // ae.login signs no exp claim into the token (it only returns it),
      // so a token without exp is treated as valid; the server
      // rejects actually invalid tokens with 401
      if (exp === undefined || exp > Date.now() / 1000) {
        headers.set('authorization', `Bearer ${token}`)
      } else {
        // token is not valid any more > remove it
        store.set(setLoginAtom, {
          username: 'Login abgelaufen',
          token: '',
        })
        setTimeout(() => {
          store.set(setLoginAtom, {
            username: '',
            token: '',
          })
        }, 10000)
      }
    } catch {
      // invalid token > request anonymous
    }
  }
  return headers
}

const buildError = async (res) => {
  const body = await res.json().catch(() => null)
  const error = new Error(body?.message ?? res.statusText)
  error.code = body?.code
  error.status = res.status
  return error
}

/**
 * fetch wrapper for the PostgREST api.
 * Throws Error with .code and .status from the
 * PostgREST error body on failure.
 */
export const apiFetch = async (path, options = {}) => {
  const headers = await authHeaders()
  Object.entries(options.headers ?? {}).forEach(([k, v]) =>
    headers.set(k, v),
  )
  const res = await fetch(`${postgrestUri()}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) throw await buildError(res)
  if (res.status === 204) return null
  return res.json()
}

// call a db function, e.g. rpc('login', { username, pass })
export const rpc = (fn, args) =>
  apiFetch(`/rpc/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args ?? {}),
  })

// total row count of a (filtered) resource, via Prefer: count=exact
export const apiCount = async (path) => {
  const headers = await authHeaders()
  headers.set('Prefer', 'count=exact')
  const res = await fetch(
    `${postgrestUri()}${path}${path.includes('?') ? '&' : '?'}limit=0`,
    { headers },
  )
  if (!res.ok) throw await buildError(res)
  // e.g. "*/423"
  const range = res.headers.get('content-range') ?? '*/0'
  return parseInt(range.split('/')[1], 10) || 0
}
