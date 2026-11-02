import { jwtDecode } from 'jwt-decode'

import { store, loginTokenAtom, setLoginAtom } from '../store'

export const postgrestUri = (): string => {
  const hostnameWithoutWww =
    typeof window !== 'undefined' ?
      window.location.hostname.replace('www.', '')
    : ''
  // 8093: ae3 dev port block (5433/8093), lets this stack coexist with
  // other local projects claiming 3000
  if (hostnameWithoutWww === 'localhost') return 'http://localhost:8093'

  return `https://api.${hostnameWithoutWww}/postgrest`
}

// headers with the login token attached; expires the token like the
// former apollo auth link did
const authHeaders = async (): Promise<Headers> => {
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

// Error enriched with the PostgREST error body, thrown by apiFetch/apiCount
export type ApiError = Error & { code?: string; status?: number }

type PostgrestErrorBody = { message?: string; code?: string }

const buildError = async (res: Response): Promise<ApiError> => {
  const body = await res.json().catch(() => null)
  const error = new Error(
    (body as PostgrestErrorBody | null)?.message ?? res.statusText,
  ) as ApiError
  error.code = (body as PostgrestErrorBody | null)?.code
  error.status = res.status
  return error
}

/**
 * fetch wrapper for the PostgREST api.
 * Throws Error with .code and .status from the
 * PostgREST error body on failure.
 * Returns the parsed json body (any: PostgREST rows are dynamic) or
 * null for empty responses.
 */
export const apiFetch = async (path: string, options: RequestInit = {}): Promise<any> => {
  const headers = await authHeaders()
  const method = options.method?.toUpperCase() ?? 'GET'
  // mutations return no body by default: rls often hides the affected
  // rows, and an empty 2xx body would fail res.json(). rpc calls
  // (like login) DO return a body, so they are excluded
  if (method !== 'GET' && !path.startsWith('/rpc/')) {
    headers.set('Prefer', 'return=minimal')
  }
  Object.entries(options.headers ?? {}).forEach(([k, v]) =>
    headers.set(k, v as string),
  )
  const res = await fetch(`${postgrestUri()}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) throw await buildError(res)
  // mutations can answer 204 or 201 with an empty body
  // (e.g. when rls hides the affected rows)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// call a db function, e.g. rpc('login', { username, pass })
export const rpc = (fn: string, args?: any, options: RequestInit = {}): Promise<any> =>
  apiFetch(`/rpc/${fn}`, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: JSON.stringify(args ?? {}),
  })

// total row count of a (filtered) resource, via Prefer: count=exact
export const apiCount = async (path: string): Promise<number> => {
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
