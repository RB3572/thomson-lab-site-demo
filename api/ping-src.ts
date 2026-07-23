import { events } from '../src/lib/events'
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, probe: 'src/lib/events', eventCount: events.length })
}
