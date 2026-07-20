import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import InstitutionalShell, { InstSection } from '@/components/InstitutionalShell'
import {
  dayKey,
  eventStart,
  events,
  googleCalUrl,
  ptDateLong,
  ptDayKey,
  ptTime,
  ptYMD,
  upcomingEvents,
  type LabEvent,
} from '@/lib/events'
import { downloadICS, subscriptionUrl } from '@/lib/calendar-client'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function CalendarIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="1" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MonthCalendar({
  eventDays,
  selectedKey,
  onSelectDay,
}: {
  /** Set of dayKeys (Pacific) that have an event. */
  eventDays: Set<string>
  selectedKey: string | null
  /** Passing null clears the selection (back to the chronological view). */
  onSelectDay: (key: string | null) => void
}) {
  const now = new Date()
  const todayKey = ptDayKey(now)

  // Anchor the initial view to the month of the soonest upcoming event, or today.
  const soonest = upcomingEvents(now)[0]
  const anchor = soonest ? ptYMD(eventStart(soonest)) : ptYMD(now)
  const [view, setView] = useState({ y: anchor.y, m: anchor.m })

  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const shift = (delta: number) => {
    setView((v) => {
      const m = v.m + delta
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }
    })
  }

  const navBtn =
    'flex h-8 w-8 items-center justify-center border text-sm transition-colors'

  return (
    <div className="inst-panel p-6 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="inst-serif text-xl">
          {MONTHS[view.m]} {view.y}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className={navBtn}
            style={{ borderColor: 'var(--inst-border)' }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className={navBtn}
            style={{ borderColor: 'var(--inst-border)' }}
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="inst-label py-2" style={{ color: 'var(--inst-muted)' }}>
            {w.slice(0, 1)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />
          const key = dayKey(view.y, view.m, d)
          const hasEvent = eventDays.has(key)
          const isToday = key === todayKey
          const isSelected = key === selectedKey

          const style: CSSProperties = isSelected
            ? { background: 'var(--inst-accent)', color: '#ffffff', fontWeight: 700 }
            : hasEvent
              ? {
                  background: 'var(--inst-alt)',
                  border: '1px solid var(--inst-accent)',
                  fontWeight: 700,
                }
              : { color: 'var(--inst-muted)' }
          if (isToday && !isSelected) style.outline = '2px solid var(--inst-accent-dark)'

          return (
            <button
              key={key}
              type="button"
              disabled={!hasEvent}
              aria-pressed={hasEvent ? isSelected : undefined}
              onClick={() => hasEvent && onSelectDay(isSelected ? null : key)}
              aria-label={`${MONTHS[view.m]} ${d}${hasEvent ? ' — has event' : ''}`}
              className={`relative flex aspect-square items-center justify-center text-sm transition-colors ${
                hasEvent ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={style}
            >
              {d}
            </button>
          )
        })}
      </div>

      <p
        className="mt-6 flex items-center gap-2 text-xs"
        style={{ color: 'var(--inst-muted)' }}
      >
        <span
          className="inline-block h-3 w-3"
          style={{
            background: 'var(--inst-alt)',
            border: '1px solid var(--inst-accent)',
          }}
        />
        Days with a scheduled event
      </p>
    </div>
  )
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="inst-card p-4">
      <div className="inst-label flex items-center gap-2">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-[0.95rem] font-semibold">{value}</p>
    </div>
  )
}

function EventCard({ event }: { event: LabEvent }) {
  const start = eventStart(event)
  return (
    <article className="inst-panel p-7">
      <p className="inst-label">Seminar</p>
      <h3 className="inst-serif mt-3 text-2xl leading-snug">{event.title}</h3>

      {event.speaker && (
        <div className="inst-rule mt-5 pl-4">
          <p className="text-lg font-semibold">{event.speaker}</p>
          <div className="inst-muted mt-1 space-y-0.5 text-sm">
            {event.host && <p>{event.host}</p>}
            {event.series && <p>{event.series}</p>}
            {event.division && <p>{event.division}</p>}
          </div>
        </div>
      )}

      {/* Structured event metadata */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MetaCard icon={<CalendarIcon />} label="Date" value={ptDateLong(start)} />
        <MetaCard icon={<ClockIcon />} label="Time" value={ptTime(start)} />
        {event.location && (
          <MetaCard icon={<PinIcon />} label="Location" value={event.location} />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadICS([event], `${event.id}.ics`)}
          className="inst-btn inst-btn-primary"
        >
          <CalendarIcon />
          Add to calendar
        </button>
        <a
          href={googleCalUrl(event)}
          target="_blank"
          rel="noreferrer"
          className="inst-btn inst-btn-secondary"
        >
          Google Calendar
        </a>
      </div>
    </article>
  )
}

export default function Calendar() {
  const now = useMemo(() => new Date(), [])
  const upcoming = useMemo(() => upcomingEvents(now), [now])
  const eventDays = useMemo(
    () => new Set(events.map((e) => ptDayKey(eventStart(e)))),
    [],
  )
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // A selected day filters against ALL events (not just upcoming), so past
  // dates marked on the calendar can still be opened.
  const dayEvents = useMemo(() => {
    if (!selectedKey) return null
    return events
      .filter((e) => ptDayKey(eventStart(e)) === selectedKey)
      .sort((a, b) => eventStart(a).getTime() - eventStart(b).getTime())
  }, [selectedKey])

  const listed = dayEvents ?? upcoming
  const heading =
    dayEvents && dayEvents.length > 0
      ? ptDateLong(eventStart(dayEvents[0]))
      : 'Upcoming Events'

  const onSelectDay = (key: string | null) => {
    setSelectedKey(key)
    // On narrow screens the list sits below the calendar, so bring it into view.
    if (key && window.innerWidth < 1024) {
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  return (
    <InstitutionalShell
      title="Calendar"
      intro="Upcoming Thomson Lab seminars and events. Add any talk to your own calendar, or subscribe to the full schedule."
    >
      <InstSection tone="warm" compact>
        <div className="flex flex-wrap items-center gap-3">
          <a href={subscriptionUrl()} className="inst-btn inst-btn-primary">
            <CalendarIcon />
            Subscribe (live updates)
          </a>
          <button
            type="button"
            onClick={() => downloadICS(events, 'thomson-lab-calendar.ics')}
            className="inst-btn inst-btn-secondary"
          >
            Download .ics
          </button>
        </div>
        <p className="inst-muted mt-4 max-w-2xl text-sm leading-relaxed">
          “Subscribe” adds a live feed that refreshes automatically as new events
          are posted. “Download .ics” imports the current events as a one-time
          file.
        </p>
      </InstSection>

      <InstSection label="Schedule">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-start">
          <MonthCalendar
            eventDays={eventDays}
            selectedKey={selectedKey}
            onSelectDay={onSelectDay}
          />

          <div ref={resultsRef} className="scroll-mt-24">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4"
              style={{ borderBottom: '1px solid var(--inst-border)' }}
            >
              <div>
                {selectedKey && <p className="inst-label">Events on</p>}
                <h2 className="inst-serif mt-1 text-2xl sm:text-3xl">{heading}</h2>
              </div>
              {selectedKey && (
                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  className="inst-link text-sm"
                >
                  ← Back to all upcoming
                </button>
              )}
            </div>

            <div className="mt-6">
              {listed.length === 0 ? (
                <p className="inst-panel inst-muted p-7 leading-relaxed">
                  {selectedKey
                    ? 'No events on this date.'
                    : 'No upcoming events scheduled. Select a highlighted date on the calendar to view that day’s events.'}
                </p>
              ) : (
                <div className="space-y-6">
                  {listed.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </InstSection>
    </InstitutionalShell>
  )
}
