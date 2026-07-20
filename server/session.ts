import { SignJWT, jwtVerify } from 'jose'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESSION_COOKIE, SESSION_TTL_SECONDS, requireEnv } from './config'

export interface Session {
  email: string
  name?: string
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(requireEnv('SESSION_SECRET'))
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ email: session.email, name: session.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey())
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    if (typeof payload.email !== 'string') return null
    return {
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    }
  } catch {
    return null
  }
}

export function parseCookies(req: VercelRequest): Record<string, string> {
  const header = req.headers.cookie
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim())
  }
  return out
}

function appendSetCookie(res: VercelResponse, cookie: string): void {
  const prev = res.getHeader('Set-Cookie')
  if (!prev) res.setHeader('Set-Cookie', cookie)
  else if (Array.isArray(prev)) res.setHeader('Set-Cookie', [...prev, cookie])
  else res.setHeader('Set-Cookie', [String(prev), cookie])
}

export function setCookie(
  res: VercelResponse,
  name: string,
  value: string,
  opts: { maxAge?: number } = {},
): void {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ]
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`)
  appendSetCookie(res, parts.join('; '))
}

export function clearCookie(res: VercelResponse, name: string): void {
  appendSetCookie(
    res,
    `${name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  )
}

export async function getSession(req: VercelRequest): Promise<Session | null> {
  const token = parseCookies(req)[SESSION_COOKIE]
  if (!token) return null
  return verifySessionToken(token)
}
