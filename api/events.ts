import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createEvent, deleteEvent, listEvents } from '../server/db.js'
import { requireAdmin } from '../server/auth.js'
import { readJsonBody, sendJson } from '../server/http.js'

function coerceEvent(b: Record<string, unknown>) {
  const duration = Number(b.durationMin)
  return {
    title: String(b.title ?? '').trim(),
    speaker: b.speaker ? String(b.speaker).trim() : null,
    start: String(b.start ?? '').trim(),
    durationMin: Number.isFinite(duration) && duration > 0 ? duration : 60,
    location: b.location ? String(b.location).trim() : null,
    host: b.host ? String(b.host).trim() : null,
    series: b.series ? String(b.series).trim() : null,
    division: b.division ? String(b.division).trim() : null,
    description: b.description ? String(b.description) : null,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      sendJson(res, 200, { events: await listEvents() })
      return
    }

    if (!(await requireAdmin(req, res))) return
    const body = readJsonBody(req)

    if (req.method === 'POST') {
      const input = coerceEvent(body)
      if (!input.title || !input.start) {
        sendJson(res, 400, { error: 'title_and_start_required' })
        return
      }
      // start must parse to a real instant (expects ISO 8601 with offset)
      if (Number.isNaN(Date.parse(input.start))) {
        sendJson(res, 400, { error: 'invalid_start' })
        return
      }
      sendJson(res, 200, await createEvent(input))
      return
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id ?? body.id ?? '')
      if (!id) {
        sendJson(res, 400, { error: 'id_required' })
        return
      }
      await deleteEvent(id)
      sendJson(res, 200, { ok: true })
      return
    }

    sendJson(res, 405, { error: 'method_not_allowed' })
  } catch (e) {
    sendJson(res, 500, { error: 'server_error', detail: (e as Error).message })
  }
}
