import type { VercelRequest, VercelResponse } from '@vercel/node'
import { listEvents } from '../server/db.js'
import { toICS, events as staticEvents } from '../src/lib/events.js'

/** Live iCal feed built from the database (falls back to bundled events). */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  let events
  try {
    events = await listEvents()
  } catch {
    events = staticEvents
  }
  res.status(200)
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.send(toICS(events))
}
