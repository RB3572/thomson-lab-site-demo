import { createRemoteJWKSet, jwtVerify } from 'jose'

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs'),
)

export function buildGoogleAuthUrl(params: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  u.searchParams.set('client_id', params.clientId)
  u.searchParams.set('redirect_uri', params.redirectUri)
  u.searchParams.set('response_type', 'code')
  u.searchParams.set('scope', 'openid email profile')
  u.searchParams.set('state', params.state)
  u.searchParams.set('prompt', 'select_account')
  u.searchParams.set('access_type', 'online')
  return u.toString()
}

export async function exchangeCodeForIdToken(params: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}): Promise<string> {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: params.code,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  if (!resp.ok) {
    throw new Error(`Token exchange failed: ${resp.status} ${await resp.text()}`)
  }
  const data = (await resp.json()) as { id_token?: string }
  if (!data.id_token) throw new Error('No id_token in token response')
  return data.id_token
}

export interface GoogleIdentity {
  email: string
  emailVerified: boolean
  name?: string
}

/** Verify the ID token signature/claims against Google's JWKS. */
export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string,
): Promise<GoogleIdentity> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: clientId,
  })
  const email = typeof payload.email === 'string' ? payload.email : ''
  if (!email) throw new Error('No email in id_token')
  return {
    email: email.toLowerCase(),
    emailVerified:
      payload.email_verified === true || payload.email_verified === 'true',
    name: typeof payload.name === 'string' ? payload.name : undefined,
  }
}
