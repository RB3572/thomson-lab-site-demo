import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  createPublication,
  deletePublication,
  getPublicationsGrouped,
  listPublicationsFlat,
} from '../server/db'
import { requireAdmin } from '../server/auth'
import { readJsonBody, sendJson } from '../server/http'

function coercePublication(b: Record<string, unknown>) {
  return {
    year: String(b.year ?? '').trim(),
    title: String(b.title ?? '').trim(),
    authors: b.authors ? String(b.authors).trim() : null,
    venue: b.venue ? String(b.venue).trim() : null,
    link: b.link ? String(b.link).trim() : null,
    img: b.img ? String(b.img).trim() : null,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      if (req.query.admin === '1') {
        if (!(await requireAdmin(req, res))) return
        sendJson(res, 200, { publications: await listPublicationsFlat() })
        return
      }
      sendJson(res, 200, { years: await getPublicationsGrouped() })
      return
    }

    if (!(await requireAdmin(req, res))) return
    const body = readJsonBody(req)

    if (req.method === 'POST') {
      const input = coercePublication(body)
      if (!input.year || !input.title) {
        sendJson(res, 400, { error: 'year_and_title_required' })
        return
      }
      sendJson(res, 200, await createPublication(input))
      return
    }

    if (req.method === 'DELETE') {
      const id = Number(req.query.id ?? body.id)
      if (!id) {
        sendJson(res, 400, { error: 'id_required' })
        return
      }
      await deletePublication(id)
      sendJson(res, 200, { ok: true })
      return
    }

    sendJson(res, 405, { error: 'method_not_allowed' })
  } catch (e) {
    sendJson(res, 500, { error: 'server_error', detail: (e as Error).message })
  }
}
