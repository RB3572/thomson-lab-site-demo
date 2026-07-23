import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  exchangeCodeForIdToken,
  verifyGoogleIdToken,
} from '../../server/google.js'
import {
  clearCookie,
  createSessionToken,
  parseCookies,
  setCookie,
} from '../../server/session.js'
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  STATE_COOKIE,
  requireEnv,
} from '../../server/config.js'
import { getBaseUrl, safeNextPath } from '../../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = typeof req.query.code === 'string' ? req.query.code : ''
  const stateParam = typeof req.query.state === 'string' ? req.query.state : ''
  if (req.query.error || !code) {
    res.redirect(302, '/?auth_error=denied')
    return
  }

  const [nonce, nextB64] = stateParam.split('.')
  const cookieNonce = parseCookies(req)[STATE_COOKIE]
  if (!nonce || !cookieNonce || nonce !== cookieNonce) {
    res.redirect(302, '/?auth_error=state')
    return
  }
  clearCookie(res, STATE_COOKIE)

  const next = safeNextPath(
    nextB64 ? Buffer.from(nextB64, 'base64url').toString() : '/',
  )
  const redirectUri = `${getBaseUrl(req)}/api/auth/callback`

  try {
    const clientId = requireEnv('GOOGLE_CLIENT_ID')
    const clientSecret = requireEnv('GOOGLE_CLIENT_SECRET')
    const idToken = await exchangeCodeForIdToken({
      code,
      clientId,
      clientSecret,
      redirectUri,
    })
    const identity = await verifyGoogleIdToken(idToken, clientId)
    if (!identity.emailVerified) {
      res.redirect(302, '/?auth_error=unverified')
      return
    }
    const token = await createSessionToken({
      email: identity.email,
      name: identity.name,
    })
    setCookie(res, SESSION_COOKIE, token, { maxAge: SESSION_TTL_SECONDS })
    res.redirect(302, next)
  } catch (e) {
    res.redirect(302, '/?auth_error=exchange')
  }
}
