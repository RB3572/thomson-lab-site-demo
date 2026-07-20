/** Client-side helpers for the /api endpoints. */

export interface SessionInfo {
  authenticated: boolean
  email?: string | null
  name?: string | null
  isAdmin?: boolean
  isAllowlisted?: boolean
}

export async function fetchSession(): Promise<SessionInfo> {
  try {
    const r = await fetch('/api/auth/me', { credentials: 'same-origin' })
    if (!r.ok) return { authenticated: false }
    return (await r.json()) as SessionInfo
  } catch {
    return { authenticated: false }
  }
}

export function loginUrl(next: string): string {
  return `/api/auth/login?next=${encodeURIComponent(next)}`
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    })
  } catch {
    /* ignore */
  }
}

/** GET that returns null on any failure (used with a static fallback). */
export async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { credentials: 'same-origin' })
    if (!r.ok) return null
    return (await r.json()) as T
  } catch {
    return null
  }
}

async function send<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> {
  const r = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) {
    throw new Error((data as { error?: string }).error || `HTTP ${r.status}`)
  }
  return data as T
}

export const apiPost = <T>(url: string, body: unknown) => send<T>('POST', url, body)
export const apiPut = <T>(url: string, body: unknown) => send<T>('PUT', url, body)
export const apiDelete = <T>(url: string) => send<T>('DELETE', url)
