import { useEffect, useState, type ReactNode } from 'react'
import InstitutionalShell, { InstSection } from '@/components/InstitutionalShell'
import { useAuth } from '@/lib/auth'
import { apiDelete, apiPost, apiPut, fetchJson } from '@/lib/api'
import { AREA_OPTIONS, SECTIONS, TITLE_OPTIONS } from '@/lib/member-meta'
import type { LabEvent } from '@/lib/events'

const PATH = '/admin'

interface MemberRow {
  id: number
  name: string
  title: string
  section: string
  tags: string[]
  bio: string | null
  email: string | null
  photo: string | null
}
interface PubRow {
  id: number
  year: string
  title: string
  authors: string | null
  venue: string | null
  link: string | null
  img: string | null
}

// --- small form primitives -------------------------------------------------

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="inst-label">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputCls =
  'w-full rounded-[2px] border px-3 py-2 text-[0.95rem] outline-none focus:border-[color:var(--inst-accent)]'
const inputStyle = { borderColor: 'var(--inst-border)', background: '#fff' }

function Notice({ msg }: { msg: { kind: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null
  return (
    <p
      className="mt-4 rounded-[2px] px-4 py-2 text-sm"
      style={{
        background: msg.kind === 'ok' ? '#f0f7ef' : '#fbeeea',
        color: msg.kind === 'ok' ? '#245c2b' : 'var(--inst-accent-dark)',
        border: `1px solid ${msg.kind === 'ok' ? '#cfe4cd' : '#f0cdbf'}`,
      }}
    >
      {msg.text}
    </p>
  )
}

// --- Members editor --------------------------------------------------------

const emptyMember = {
  name: '',
  title: TITLE_OPTIONS[1].label,
  tags: [] as string[],
  bio: '',
  email: '',
  photo: '',
}

function MembersEditor() {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [form, setForm] = useState({ ...emptyMember })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const load = () =>
    fetchJson<{ members: MemberRow[] }>('/api/members?admin=1').then((d) =>
      setMembers(d?.members ?? []),
    )
  useEffect(() => {
    void load()
  }, [])

  const reset = () => {
    setForm({ ...emptyMember })
    setEditingId(null)
  }

  const toggleTag = (t: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }))

  const submit = async () => {
    setBusy(true)
    setMsg(null)
    try {
      if (editingId) await apiPut(`/api/members`, { id: editingId, ...form })
      else await apiPost(`/api/members`, form)
      setMsg({ kind: 'ok', text: editingId ? 'Member updated.' : 'Member added.' })
      reset()
      await load()
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const edit = (m: MemberRow) => {
    setEditingId(m.id)
    setForm({
      name: m.name,
      title: m.title,
      tags: m.tags ?? [],
      bio: m.bio ?? '',
      email: m.email ?? '',
      photo: m.photo ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this member?')) return
    try {
      await apiDelete(`/api/members?id=${id}`)
      await load()
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="inst-card p-7">
        <h3 className="inst-serif text-xl">
          {editingId ? 'Edit member' : 'Add member'}
        </h3>
        <div className="mt-5 space-y-4">
          <Field label="Name">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.name}
              placeholder="Fan Yang"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <select
              className={inputCls}
              style={inputStyle}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            >
              {TITLE_OPTIONS.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags">
            <div className="flex flex-wrap gap-2">
              {AREA_OPTIONS.map((t) => {
                const on = form.tags.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className="rounded-[2px] border px-3 py-1.5 text-sm"
                    style={{
                      borderColor: on ? 'var(--inst-accent)' : 'var(--inst-border)',
                      background: on ? 'var(--inst-accent)' : '#fff',
                      color: on ? '#fff' : 'var(--inst-text)',
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </Field>
          <Field label="Bio">
            <textarea
              className={inputCls}
              style={inputStyle}
              rows={3}
              value={form.bio}
              placeholder="Engineering protein machines for microfluidics automation…"
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>
          <Field label="Caltech email (used for secure-resources access)">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.email}
              placeholder="fy2@caltech.edu"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Photo path (optional, e.g. /team/fan-yang.jpg)">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.photo}
              placeholder="/team/fan-yang.jpg"
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
            />
          </Field>
        </div>
        <Notice msg={msg} />
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="inst-btn inst-btn-primary"
          >
            {editingId ? 'Save changes' : 'Add member'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="inst-btn inst-btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="inst-serif text-xl">Current members ({members.length})</h3>
        <div className="mt-5 space-y-3">
          {SECTIONS.map((s) => {
            const rows = members.filter((m) => m.section === s.id)
            if (!rows.length) return null
            return (
              <div key={s.id}>
                <p className="inst-label mt-4">{s.title}</p>
                {rows.map((m) => (
                  <div
                    key={m.id}
                    className="mt-2 flex items-center justify-between gap-3 border-b py-2"
                    style={{ borderColor: 'var(--inst-border)' }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{m.name}</p>
                      <p className="inst-muted truncate text-sm">
                        {m.title}
                        {m.email ? ` · ${m.email}` : ' · no email'}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button className="inst-link" onClick={() => edit(m)}>
                        Edit
                      </button>
                      <button
                        className="inst-link"
                        onClick={() => remove(m.id)}
                        style={{ color: 'var(--inst-accent-dark)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// --- Events editor ---------------------------------------------------------

const emptyEvent = {
  title: '',
  speaker: '',
  date: '',
  time: '13:00',
  location: '',
  host: 'Thomson Lab',
  series: '',
  division: '',
  description: '',
}

function EventsEditor() {
  const [events, setEvents] = useState<LabEvent[]>([])
  const [form, setForm] = useState({ ...emptyEvent })
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const load = () =>
    fetchJson<{ events: LabEvent[] }>('/api/events').then((d) =>
      setEvents(d?.events ?? []),
    )
  useEffect(() => {
    void load()
  }, [])

  const submit = async () => {
    setBusy(true)
    setMsg(null)
    try {
      if (!form.date) throw new Error('Please choose a date.')
      // Pacific time (PDT). Stored with an explicit offset.
      const start = `${form.date}T${form.time || '00:00'}:00-07:00`
      await apiPost(`/api/events`, {
        title: form.title,
        speaker: form.speaker,
        start,
        durationMin: 60,
        location: form.location,
        host: form.host,
        series: form.series,
        division: form.division,
        description: form.description,
      })
      setMsg({ kind: 'ok', text: 'Event added.' })
      setForm({ ...emptyEvent })
      await load()
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      await apiDelete(`/api/events?id=${encodeURIComponent(id)}`)
      await load()
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="inst-card p-7">
        <h3 className="inst-serif text-xl">Add calendar event</h3>
        <div className="mt-5 space-y-4">
          <Field label="Talk title">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Speaker">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.speaker}
              onChange={(e) => setForm({ ...form, speaker: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date (Pacific)">
              <input
                type="date"
                className={inputCls}
                style={inputStyle}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Time (Pacific)">
              <input
                type="time"
                className={inputCls}
                style={inputStyle}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Location">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.location}
              placeholder="Chen 130"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Host">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.host}
              onChange={(e) => setForm({ ...form, host: e.target.value })}
            />
          </Field>
          <Field label="Series (optional)">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.series}
              placeholder="Computation & Neural Systems Option"
              onChange={(e) => setForm({ ...form, series: e.target.value })}
            />
          </Field>
          <Field label="Division (optional)">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.division}
              onChange={(e) => setForm({ ...form, division: e.target.value })}
            />
          </Field>
        </div>
        <Notice msg={msg} />
        <button
          type="button"
          disabled={busy}
          onClick={submit}
          className="inst-btn inst-btn-primary mt-6"
        >
          Add event
        </button>
      </div>

      <div>
        <h3 className="inst-serif text-xl">Scheduled events ({events.length})</h3>
        <div className="mt-5 space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between gap-3 border-b py-2"
              style={{ borderColor: 'var(--inst-border)' }}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{ev.title}</p>
                <p className="inst-muted truncate text-sm">
                  {new Date(ev.start).toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                  {ev.speaker ? ` · ${ev.speaker}` : ''}
                </p>
              </div>
              <button
                className="inst-link shrink-0 text-sm"
                style={{ color: 'var(--inst-accent-dark)' }}
                onClick={() => remove(ev.id)}
              >
                Delete
              </button>
            </div>
          ))}
          {events.length === 0 && (
            <p className="inst-muted text-sm">No events yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Publications editor ---------------------------------------------------

const emptyPub = {
  year: String(new Date().getFullYear()),
  title: '',
  authors: '',
  venue: '',
  link: '',
  img: '',
}

function PublicationsEditor() {
  const [pubs, setPubs] = useState<PubRow[]>([])
  const [form, setForm] = useState({ ...emptyPub })
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const load = () =>
    fetchJson<{ publications: PubRow[] }>('/api/publications?admin=1').then((d) =>
      setPubs(d?.publications ?? []),
    )
  useEffect(() => {
    void load()
  }, [])

  const submit = async () => {
    setBusy(true)
    setMsg(null)
    try {
      await apiPost(`/api/publications`, form)
      setMsg({ kind: 'ok', text: 'Publication added.' })
      setForm({ ...emptyPub })
      await load()
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this publication?')) return
    try {
      await apiDelete(`/api/publications?id=${id}`)
      await load()
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="inst-card p-7">
        <h3 className="inst-serif text-xl">Add publication</h3>
        <div className="mt-5 space-y-4">
          <Field label="Year">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Authors">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.authors}
              onChange={(e) => setForm({ ...form, authors: e.target.value })}
            />
          </Field>
          <Field label="Venue">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.venue}
              placeholder="Nature Machine Intelligence"
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
          </Field>
          <Field label="Link (optional)">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </Field>
          <Field label="Image path (optional)">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.img}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
            />
          </Field>
        </div>
        <Notice msg={msg} />
        <button
          type="button"
          disabled={busy}
          onClick={submit}
          className="inst-btn inst-btn-primary mt-6"
        >
          Add publication
        </button>
      </div>

      <div>
        <h3 className="inst-serif text-xl">Publications ({pubs.length})</h3>
        <div className="mt-5 space-y-3">
          {pubs.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 border-b py-2"
              style={{ borderColor: 'var(--inst-border)' }}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="inst-muted truncate text-sm">
                  {p.year}
                  {p.venue ? ` · ${p.venue}` : ''}
                </p>
              </div>
              <button
                className="inst-link shrink-0 text-sm"
                style={{ color: 'var(--inst-accent-dark)' }}
                onClick={() => remove(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- page ------------------------------------------------------------------

const TABS = ['Members', 'Events', 'Publications'] as const
type Tab = (typeof TABS)[number]

export default function Admin() {
  const auth = useAuth()
  const [tab, setTab] = useState<Tab>('Members')

  let body: ReactNode
  if (auth.loading) {
    body = <p className="inst-muted">Checking your access…</p>
  } else if (!auth.authenticated) {
    body = (
      <div className="inst-panel max-w-xl p-8">
        <p className="inst-label">Admin</p>
        <h2 className="inst-serif mt-3 text-2xl">Sign in required</h2>
        <p className="inst-muted mt-3 leading-relaxed">
          The admin console is restricted to lab administrators.
        </p>
        <button
          type="button"
          onClick={() => auth.login(PATH)}
          className="inst-btn inst-btn-primary mt-6"
        >
          Sign in with Google
        </button>
      </div>
    )
  } else if (!auth.isAdmin) {
    body = (
      <div className="inst-panel max-w-xl p-8">
        <p className="inst-label">Access denied</p>
        <h2 className="inst-serif mt-3 text-2xl">Not an administrator</h2>
        <p className="inst-muted mt-3 leading-relaxed">
          You’re signed in as <span className="font-semibold">{auth.email}</span>,
          which isn’t an admin account.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => auth.login(PATH)}
            className="inst-btn inst-btn-secondary"
          >
            Use a different account
          </button>
          <button
            type="button"
            onClick={auth.logout}
            className="inst-btn inst-btn-secondary"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  } else {
    body = (
      <div>
        <div
          className="mb-8 flex flex-wrap items-center justify-between gap-4 pb-4"
          style={{ borderBottom: '1px solid var(--inst-border)' }}
        >
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="inst-btn"
                style={
                  tab === t
                    ? {
                        background: 'var(--inst-accent)',
                        color: '#fff',
                        border: '1px solid var(--inst-accent)',
                      }
                    : {
                        background: '#fff',
                        color: 'var(--inst-text)',
                        border: '1px solid var(--inst-border)',
                      }
                }
              >
                {t}
              </button>
            ))}
          </div>
          <p className="inst-muted text-sm">
            {auth.email} ·{' '}
            <button className="inst-link" onClick={auth.logout}>
              Sign out
            </button>
          </p>
        </div>

        {tab === 'Members' && <MembersEditor />}
        {tab === 'Events' && <EventsEditor />}
        {tab === 'Publications' && <PublicationsEditor />}
      </div>
    )
  }

  return (
    <InstitutionalShell
      eyebrow="Thomson Lab — Admin"
      title="Site Administration"
      intro="Add and edit members, calendar events, and publications. Member emails become the allowlist for the secure resources area."
    >
      <InstSection compact>{body}</InstSection>
    </InstitutionalShell>
  )
}
