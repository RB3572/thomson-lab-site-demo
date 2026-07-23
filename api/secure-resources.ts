import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAllowlisted } from '../server/auth.js'
import { SECURE_DRIVE_URL } from '../server/config.js'
import { sendJson } from '../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Gate BEFORE returning any protected content: the Drive link never reaches
  // the browser unless the caller is an authenticated, allowlisted lab member.
  const email = await requireAllowlisted(req, res)
  if (!email) return

  sendJson(res, 200, {
    email,
    resources: [
      {
        title: 'Caltech presentation assets',
        description:
          'Logos, slide templates, and other branded assets from Caltech for lab presentations.',
        href: SECURE_DRIVE_URL,
        kind: 'drive',
      },
    ],
  })
}
