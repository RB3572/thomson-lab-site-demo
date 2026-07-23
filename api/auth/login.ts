import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomBytes } from 'node:crypto'
import { buildGoogleAuthUrl } from '../../server/google.js'
import { setCookie } from '../../server/session.js'
import { STATE_COOKIE, requireEnv } from '../../server/config.js'
import { getBaseUrl, safeNextPath } from '../../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const clientId = requireEnv('GOOGLE_CLIENT_ID')
    const next = safeNextPath(req.query.next)
    const nonce = randomBytes(16).toString('hex')
    // Bind the post-login destination into the state (verified via cookie nonce).
    const state = `${nonce}.${Buffer.from(next).toString('base64url')}`
    setCookie(res, STATE_COOKIE, nonce, { maxAge: 600 })
    const redirectUri = `${getBaseUrl(req)}/api/auth/callback`
    res.redirect(302, buildGoogleAuthUrl({ clientId, redirectUri, state }))
  } catch (e) {
    res.redirect(302, `/?auth_error=config`)
  }
}
