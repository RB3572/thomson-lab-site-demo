export interface LabEvent {
  id: string
  title: string
  speaker?: string
  /** Absolute start instant as an ISO 8601 string WITH offset (e.g. -07:00). */
  start: string
  /** Length of the event in minutes (default 60). */
  durationMin?: number
  location?: string
  host?: string
  series?: string
  division?: string
  description?: string
}

/**
 * Lab calendar. Times are stored with an explicit offset so they resolve to the
 * correct absolute instant; everything is displayed in Caltech's timezone (PT).
 */
export const events: LabEvent[] = [
  {
    id: 'gornet-2026-07-15',
    title: 'Predictive Coding for Cognitive Mapping',
    speaker: 'James Gornet',
    start: '2026-07-15T13:00:00-07:00',
    durationMin: 60,
    location: 'Chen 130',
    host: 'Thomson Lab',
    series: 'Computation & Neural Systems Option',
    division: 'Division of Biology and Biological Engineering',
  },
]

const TZ = 'America/Los_Angeles'

export function eventStart(e: LabEvent): Date {
  return new Date(e.start)
}

export function eventEnd(e: LabEvent): Date {
  return new Date(eventStart(e).getTime() + (e.durationMin ?? 60) * 60_000)
}

/** Calendar-day parts of an instant, evaluated in Pacific time. */
export function ptYMD(d: Date): { y: number; m: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value)
  return { y: get('year'), m: get('month') - 1, day: get('day') }
}

/** Stable "YYYY-M-D" key for a Pacific calendar day. */
export function dayKey(y: number, m: number, day: number): string {
  return `${y}-${m}-${day}`
}

export function ptDayKey(d: Date): string {
  const { y, m, day } = ptYMD(d)
  return dayKey(y, m, day)
}

export function ptTime(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(d)
}

export function ptDateLong(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/** Upcoming events (not yet ended) from a given list, soonest first. */
export function upcomingFrom(
  list: LabEvent[],
  now: Date = new Date(),
): LabEvent[] {
  return list
    .filter((e) => eventEnd(e) >= now)
    .sort((a, b) => eventStart(a).getTime() - eventStart(b).getTime())
}

/** Upcoming events from the bundled static list, soonest first. */
export function upcomingEvents(now: Date = new Date()): LabEvent[] {
  return upcomingFrom(events, now)
}

// ---------------------------------------------------------------------------
// iCal (RFC 5545) generation
// ---------------------------------------------------------------------------

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** UTC timestamp in iCal basic format, e.g. 20260715T200000Z */
function icsStamp(d: Date): string {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  )
}

function icsEscape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/** Fold a content line to 75 octets per RFC 5545. */
function fold(line: string): string {
  if (line.length <= 75) return line
  const out: string[] = []
  let rest = line
  out.push(rest.slice(0, 75))
  rest = rest.slice(75)
  while (rest.length > 74) {
    out.push(' ' + rest.slice(0, 74))
    rest = rest.slice(74)
  }
  if (rest.length) out.push(' ' + rest)
  return out.join('\r\n')
}

function eventDescription(e: LabEvent): string {
  return [e.speaker, e.host, e.series, e.division, e.description]
    .filter(Boolean)
    .join('\n')
}

function eventSummary(e: LabEvent): string {
  return e.speaker ? `${e.speaker} — ${e.title}` : e.title
}

function vevent(e: LabEvent, stamp: Date): string {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${e.id}@thomsonlab.caltech.edu`,
    `DTSTAMP:${icsStamp(stamp)}`,
    `DTSTART:${icsStamp(eventStart(e))}`,
    `DTEND:${icsStamp(eventEnd(e))}`,
    `SUMMARY:${icsEscape(eventSummary(e))}`,
    e.location ? `LOCATION:${icsEscape(e.location)}` : '',
    `DESCRIPTION:${icsEscape(eventDescription(e))}`,
    'END:VEVENT',
  ].filter(Boolean)
  return lines.map(fold).join('\r\n')
}

/** Build a full VCALENDAR string for one or more events. */
export function toICS(list: LabEvent[]): string {
  const stamp = new Date()
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Thomson Lab//Lab Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Thomson Lab',
    ...list.map((e) => vevent(e, stamp)),
    'END:VCALENDAR',
  ]
  return body.join('\r\n')
}

/** Path of the static, subscribable calendar feed (emitted at build time). */
export const CALENDAR_FEED_PATH = '/thomson-lab-events.ics'

/** Google Calendar "add event" URL (opens a pre-filled event). */
export function googleCalUrl(e: LabEvent): string {
  const fmt = (d: Date) => icsStamp(d)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventSummary(e),
    dates: `${fmt(eventStart(e))}/${fmt(eventEnd(e))}`,
    details: eventDescription(e),
    location: e.location ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
