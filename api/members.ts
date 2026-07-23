import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  createMember,
  deleteMember,
  getTeamPublic,
  listMembers,
  updateMember,
} from '../server/db.js'
import { requireAdmin } from '../server/auth.js'
import { readJsonBody, sendJson } from '../server/http.js'

function coerceMember(b: Record<string, unknown>) {
  const tags = Array.isArray(b.tags)
    ? b.tags.map(String)
    : typeof b.tags === 'string'
      ? b.tags.split(',').map((s) => s.trim()).filter(Boolean)
      : []
  return {
    name: String(b.name ?? '').trim(),
    title: String(b.title ?? '').trim(),
    tags,
    bio: b.bio ? String(b.bio) : null,
    email: b.email ? String(b.email).trim() : null,
    photo: b.photo ? String(b.photo).trim() : null,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      // Admin listing (flat, with ids + emails) requires auth; public is grouped.
      if (req.query.admin === '1') {
        if (!(await requireAdmin(req, res))) return
        sendJson(res, 200, { members: await listMembers() })
        return
      }
      sendJson(res, 200, { sections: await getTeamPublic() })
      return
    }

    if (!(await requireAdmin(req, res))) return
    const body = readJsonBody(req)

    if (req.method === 'POST') {
      const input = coerceMember(body)
      if (!input.name || !input.title) {
        sendJson(res, 400, { error: 'name_and_title_required' })
        return
      }
      sendJson(res, 200, await createMember(input))
      return
    }

    if (req.method === 'PUT') {
      const id = Number(body.id)
      if (!id) {
        sendJson(res, 400, { error: 'id_required' })
        return
      }
      const updated = await updateMember(id, coerceMember(body))
      sendJson(res, updated ? 200 : 404, updated ?? { error: 'not_found' })
      return
    }

    if (req.method === 'DELETE') {
      const id = Number(req.query.id ?? body.id)
      if (!id) {
        sendJson(res, 400, { error: 'id_required' })
        return
      }
      await deleteMember(id)
      sendJson(res, 200, { ok: true })
      return
    }

    sendJson(res, 405, { error: 'method_not_allowed' })
  } catch (e) {
    sendJson(res, 500, { error: 'server_error', detail: (e as Error).message })
  }
}
