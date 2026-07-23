import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearCookie } from '../../server/session.js'
import { SESSION_COOKIE } from '../../server/config.js'
import { sendJson } from '../../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  clearCookie(res, SESSION_COOKIE)
  if (req.method === 'GET') {
    res.redirect(302, '/')
    return
  }
  sendJson(res, 200, { ok: true })
}
