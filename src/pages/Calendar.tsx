import { useMemo, useRef, useState } from 'react'
import PageShell from '@/components/PageShell'
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

function CalendarIcon() {
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
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
  onSelectDay: (key: string) => void
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

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111]/70 p-6 backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          {MONTHS[view.m]} {view.y}
        </h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#f7cc34] hover:text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#f7cc34] hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-white/45">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1.5">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />
          const key = dayKey(view.y, view.m, d)
          const hasEvent = eventDays.has(key)
          const isToday = key === todayKey
          const isSelected = key === selectedKey
          return (
            <button
              key={key}
              type="button"
              disabled={!hasEvent}
              onClick={() => hasEvent && onSelectDay(key)}
              aria-label={`${MONTHS[view.m]} ${d}${hasEvent ? ' — has event' : ''}`}
              className={[
                'relative flex aspect-square items-center justify-center rounded-lg text-sm transition-colors',
                isSelected
                  ? 'bg-[#f7cc34] font-bold text-[#1b1408]'
                  : isToday
                    ? 'font-bold text-white ring-1 ring-[#f7cc34]'
                    : 'text-white/80',
                hasEvent && !isSelected
                  ? 'cursor-pointer bg-white/5 font-semibold hover:bg-white/10'
                  : '',
                !hasEvent ? 'cursor-default' : '',
              ].join(' ')}
            >
              {d}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#f7cc34]" />
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-5 flex items-center gap-2 text-xs text-white/45">
        <span className="h-1.5 w-1.5 rounded-full bg-[#f7cc34]" />
        Days with a scheduled event
      </p>
    </div>
  )
}

function EventCard({
  event,
  highlighted,
  cardRef,
}: {
  event: LabEvent
  highlighted: boolean
  cardRef?: (el: HTMLElement | null) => void
}) {
  const start = eventStart(event)
  return (
    <article
      ref={cardRef}
      className={[
        'scroll-mt-28 rounded-2xl border bg-[#111111]/70 p-6 backdrop-blur-md transition-colors',
        highlighted ? 'border-[#f7cc34]/70' : 'border-white/10',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-[#f7cc34]">
          {ptDateLong(start)}
        </p>
      </div>
      <p className="mt-1 text-sm text-white/60">
        {ptTime(start)}
        {event.location && <span> · {event.location}</span>}
      </p>

      <h3 className="mt-4 text-xl font-bold leading-snug text-white">
        “{event.title}”
      </h3>
      {event.speaker && (
        <p className="mt-2 font-medium text-white/90">{event.speaker}</p>
      )}

      <div className="mt-3 space-y-0.5 text-sm text-white/70">
        {event.host && <p>{event.host}</p>}
        {event.series && <p>{event.series}</p>}
        {event.division && <p>{event.division}</p>}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadICS([event], `${event.id}.ics`)}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-[#f7cc34] transition-colors hover:border-[#f7cc34] hover:text-white"
        >
          <CalendarIcon />
          Add to calendar
        </button>
        <a
          href={googleCalUrl(event)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:border-white/40 hover:text-white"
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
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())

  const onSelectDay = (key: string) => {
    setSelectedKey(key)
    const match = upcoming.find((e) => ptDayKey(eventStart(e)) === key)
    if (match) {
      cardRefs.current
        .get(match.id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <PageShell
      title="Calendar"
      intro="Upcoming Thomson Lab seminars and events. Add any talk to your own calendar, or subscribe to the whole schedule."
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <a
          href={subscriptionUrl()}
          className="inline-flex items-center gap-2 rounded-full border border-[#f7cc34]/60 bg-[#f7cc34]/10 px-5 py-2.5 font-medium text-[#f7cc34] transition-colors hover:border-[#f7cc34] hover:bg-[#f7cc34]/20 hover:text-white"
        >
          <CalendarIcon />
          Subscribe (live updates)
        </a>
        <button
          type="button"
          onClick={() => downloadICS(events, 'thomson-lab-calendar.ics')}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Download .ics
        </button>
      </div>
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-white/50">
        “Subscribe” adds a live feed that refreshes automatically as new events
        are posted. “Download .ics” imports the current events as a one-time file.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start">
        <MonthCalendar
          eventDays={eventDays}
          selectedKey={selectedKey}
          onSelectDay={onSelectDay}
        />

        <div>
          <h2 className="mb-4 text-lg font-bold text-white">Upcoming events</h2>
          {upcoming.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-[#111111]/70 p-6 text-white/70 backdrop-blur-md">
              No upcoming events scheduled. Check back soon.
            </p>
          ) : (
            <div className="space-y-5">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  highlighted={
                    selectedKey === ptDayKey(eventStart(event))
                  }
                  cardRef={(el) => {
                    if (el) cardRefs.current.set(event.id, el)
                    else cardRefs.current.delete(event.id)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
