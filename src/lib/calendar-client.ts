import { toICS, type LabEvent } from './events'

/** Live, database-backed iCal feed served by the /api/calendar function. */
const CALENDAR_FEED_PATH = '/api/calendar'

/** Browser-only calendar helpers (kept out of events.ts so that module stays
 *  Node-safe for the build-time feed generator in vite.config). */

/** Trigger a download of an .ics file for the given events. */
export function downloadICS(list: LabEvent[], filename = 'thomson-lab.ics'): void {
  const blob = new Blob([toICS(list)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/**
 * webcal:// URL for the live-updating feed at the current host. Calendar apps
 * poll this periodically, so subscribers pick up new events after each deploy.
 */
export function subscriptionUrl(): string {
  if (typeof window === 'undefined') return CALENDAR_FEED_PATH
  return `webcal://${window.location.host}${CALENDAR_FEED_PATH}`
}
