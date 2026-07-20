import type { VercelRequest, VercelResponse } from '@vercel/node'

/** Absolute origin the request arrived on (works on the custom domain, vercel.app,
 *  and preview deploys). Used to build the OAuth redirect URI + post-login redirects. */
export function getBaseUrl(req: VercelRequest): string {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || ''
  return `${proto}://${host}`
}

export function sendJson(res: VercelResponse, status: number, body: unknown): void {
  res.status(status)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(body))
}

/** Vercel auto-parses JSON bodies; normalise to an object regardless. */
export function readJsonBody(req: VercelRequest): Record<string, unknown> {
  const b = req.body
  if (!b) return {}
  if (typeof b === 'object') return b as Record<string, unknown>
  if (typeof b === 'string') {
    try {
      return JSON.parse(b) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return {}
}

/** Only allow same-origin relative paths as post-login redirect targets. */
export function safeNextPath(next: unknown): string {
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
    return next
  }
  return '/'
}
