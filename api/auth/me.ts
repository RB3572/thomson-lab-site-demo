import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSession } from '../../server/session.js'
import { isAdminEmail } from '../../server/config.js'
import { isAllowlisted } from '../../server/auth.js'
import { sendJson } from '../../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await getSession(req)
  if (!session) {
    sendJson(res, 200, { authenticated: false })
    return
  }
  const admin = isAdminEmail(session.email)
  let allowlisted = admin
  if (!admin) {
    try {
      allowlisted = await isAllowlisted(session.email)
    } catch {
      allowlisted = false
    }
  }
  sendJson(res, 200, {
    authenticated: true,
    email: session.email,
    name: session.name ?? null,
    isAdmin: admin,
    isAllowlisted: allowlisted,
  })
}
