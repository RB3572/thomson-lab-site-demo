import { neon } from '@neondatabase/serverless'
import { team } from '../src/lib/team'
import { publications as staticPublications } from '../src/lib/publications'
import { events as staticEvents } from '../src/lib/events'
import { SECTIONS, titleToSection } from '../src/lib/member-meta'
import type { TeamSection, Member } from '../src/lib/team'
import type { PubYear } from '../src/lib/publications'
import type { LabEvent } from '../src/lib/events'

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  ''

const sql = neon(connectionString)

// ---------------------------------------------------------------------------
// Schema (idempotent) + one-time seed from the bundled static data
// ---------------------------------------------------------------------------

let schemaReady: Promise<void> | null = null

export function ensureSchema(): Promise<void> {
  if (!connectionString) {
    return Promise.reject(new Error('DATABASE_URL is not configured'))
  }
  if (!schemaReady) schemaReady = initSchema()
  return schemaReady
}

async function initSchema(): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS members (
    id serial PRIMARY KEY,
    name text NOT NULL,
    title text NOT NULL,
    section text NOT NULL,
    tags text[] NOT NULL DEFAULT '{}',
    bio text,
    email text,
    photo text,
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`
  await sql`CREATE TABLE IF NOT EXISTS events (
    id text PRIMARY KEY,
    title text NOT NULL,
    speaker text,
    start_iso text NOT NULL,
    duration_min int NOT NULL DEFAULT 60,
    location text,
    host text,
    series text,
    division text,
    description text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`
  await sql`CREATE TABLE IF NOT EXISTS publications (
    id serial PRIMARY KEY,
    year text NOT NULL,
    title text NOT NULL,
    authors text,
    venue text,
    link text,
    img text,
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`
  await seedIfEmpty()
}

async function seedIfEmpty(): Promise<void> {
  const [m] = (await sql`SELECT count(*)::int AS n FROM members`) as { n: number }[]
  if (m.n === 0) {
    let order = 0
    for (const section of team) {
      for (const member of section.members) {
        await sql`INSERT INTO members (name, title, section, tags, bio, email, photo, sort_order)
          VALUES (${member.name}, ${member.role}, ${section.id}, ${member.areas ?? []},
                  ${member.focus ?? null}, ${null}, ${member.photo ?? null}, ${order++})`
      }
    }
  }

  const [e] = (await sql`SELECT count(*)::int AS n FROM events`) as { n: number }[]
  if (e.n === 0) {
    for (const ev of staticEvents) {
      await sql`INSERT INTO events (id, title, speaker, start_iso, duration_min, location, host, series, division, description)
        VALUES (${ev.id}, ${ev.title}, ${ev.speaker ?? null}, ${ev.start}, ${ev.durationMin ?? 60},
                ${ev.location ?? null}, ${ev.host ?? null}, ${ev.series ?? null}, ${ev.division ?? null}, ${ev.description ?? null})`
    }
  }

  const [p] = (await sql`SELECT count(*)::int AS n FROM publications`) as { n: number }[]
  if (p.n === 0) {
    let order = 0
    for (const group of staticPublications) {
      for (const item of group.items) {
        await sql`INSERT INTO publications (year, title, authors, venue, link, img, sort_order)
          VALUES (${group.year}, ${item.title}, ${item.authors ?? null}, ${item.venue ?? null},
                  ${item.link ?? null}, ${item.img ?? null}, ${order++})`
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export interface MemberRow {
  id: number
  name: string
  title: string
  section: string
  tags: string[]
  bio: string | null
  email: string | null
  photo: string | null
  sort_order: number
}

export async function listMembers(): Promise<MemberRow[]> {
  await ensureSchema()
  return (await sql`SELECT id, name, title, section, tags, bio, email, photo, sort_order
    FROM members ORDER BY sort_order, id`) as MemberRow[]
}

/** Public team, grouped into sections (no emails exposed). */
export async function getTeamPublic(): Promise<TeamSection[]> {
  const rows = await listMembers()
  return SECTIONS.map((meta): TeamSection => ({
    id: meta.id,
    title: meta.title,
    color: meta.color,
    members: rows
      .filter((r) => r.section === meta.id)
      .map((r): Member => ({
        name: r.name,
        role: r.title,
        focus: r.bio ?? undefined,
        areas: r.tags.length ? r.tags : undefined,
        photo: r.photo ?? undefined,
      })),
  })).filter((s) => s.members.length > 0)
}

/** Lowercased member emails — the allowlist for the secure area. */
export async function getMemberEmails(): Promise<string[]> {
  await ensureSchema()
  const rows = (await sql`SELECT email FROM members WHERE email IS NOT NULL AND email <> ''`) as {
    email: string
  }[]
  return rows.map((r) => r.email.trim().toLowerCase()).filter(Boolean)
}

export async function createMember(input: {
  name: string
  title: string
  tags: string[]
  bio?: string | null
  email?: string | null
  photo?: string | null
}): Promise<MemberRow> {
  await ensureSchema()
  const section = titleToSection(input.title)
  const [{ next }] = (await sql`SELECT COALESCE(max(sort_order), 0) + 1 AS next FROM members`) as {
    next: number
  }[]
  const rows = (await sql`INSERT INTO members (name, title, section, tags, bio, email, photo, sort_order)
    VALUES (${input.name}, ${input.title}, ${section}, ${input.tags ?? []},
            ${input.bio ?? null}, ${input.email?.toLowerCase() ?? null}, ${input.photo ?? null}, ${next})
    RETURNING id, name, title, section, tags, bio, email, photo, sort_order`) as MemberRow[]
  return rows[0]
}

export async function updateMember(
  id: number,
  input: {
    name: string
    title: string
    tags: string[]
    bio?: string | null
    email?: string | null
    photo?: string | null
  },
): Promise<MemberRow | null> {
  await ensureSchema()
  const section = titleToSection(input.title)
  const rows = (await sql`UPDATE members SET
      name = ${input.name},
      title = ${input.title},
      section = ${section},
      tags = ${input.tags ?? []},
      bio = ${input.bio ?? null},
      email = ${input.email?.toLowerCase() ?? null},
      photo = ${input.photo ?? null}
    WHERE id = ${id}
    RETURNING id, name, title, section, tags, bio, email, photo, sort_order`) as MemberRow[]
  return rows[0] ?? null
}

export async function deleteMember(id: number): Promise<void> {
  await ensureSchema()
  await sql`DELETE FROM members WHERE id = ${id}`
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

interface EventRow {
  id: string
  title: string
  speaker: string | null
  start_iso: string
  duration_min: number
  location: string | null
  host: string | null
  series: string | null
  division: string | null
  description: string | null
}

function toLabEvent(r: EventRow): LabEvent {
  return {
    id: r.id,
    title: r.title,
    speaker: r.speaker ?? undefined,
    start: r.start_iso,
    durationMin: r.duration_min,
    location: r.location ?? undefined,
    host: r.host ?? undefined,
    series: r.series ?? undefined,
    division: r.division ?? undefined,
    description: r.description ?? undefined,
  }
}

export async function listEvents(): Promise<LabEvent[]> {
  await ensureSchema()
  const rows = (await sql`SELECT id, title, speaker, start_iso, duration_min, location, host, series, division, description
    FROM events ORDER BY start_iso`) as EventRow[]
  return rows.map(toLabEvent)
}

export async function createEvent(input: {
  title: string
  speaker?: string | null
  start: string
  durationMin?: number
  location?: string | null
  host?: string | null
  series?: string | null
  division?: string | null
  description?: string | null
}): Promise<LabEvent> {
  await ensureSchema()
  const id = `${slug(input.title)}-${input.start.slice(0, 10)}-${Math.abs(hash(input.start + input.title)) % 100000}`
  const rows = (await sql`INSERT INTO events (id, title, speaker, start_iso, duration_min, location, host, series, division, description)
    VALUES (${id}, ${input.title}, ${input.speaker ?? null}, ${input.start}, ${input.durationMin ?? 60},
            ${input.location ?? null}, ${input.host ?? null}, ${input.series ?? null}, ${input.division ?? null}, ${input.description ?? null})
    RETURNING id, title, speaker, start_iso, duration_min, location, host, series, division, description`) as EventRow[]
  return toLabEvent(rows[0])
}

export async function deleteEvent(id: string): Promise<void> {
  await ensureSchema()
  await sql`DELETE FROM events WHERE id = ${id}`
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

interface PubRow {
  id: number
  year: string
  title: string
  authors: string | null
  venue: string | null
  link: string | null
  img: string | null
  sort_order: number
}

export async function listPublicationsFlat(): Promise<PubRow[]> {
  await ensureSchema()
  return (await sql`SELECT id, year, title, authors, venue, link, img, sort_order
    FROM publications ORDER BY year DESC, sort_order, id`) as PubRow[]
}

/** Publications grouped by year (newest first) for the public page. */
export async function getPublicationsGrouped(): Promise<PubYear[]> {
  const rows = await listPublicationsFlat()
  const byYear = new Map<string, PubYear>()
  for (const r of rows) {
    let group = byYear.get(r.year)
    if (!group) {
      group = { year: r.year, items: [] }
      byYear.set(r.year, group)
    }
    group.items.push({
      title: r.title,
      authors: r.authors ?? '',
      venue: r.venue ?? '',
      link: r.link ?? undefined,
      img: r.img ?? undefined,
    })
  }
  return [...byYear.values()].sort((a, b) => b.year.localeCompare(a.year))
}

export async function createPublication(input: {
  year: string
  title: string
  authors?: string | null
  venue?: string | null
  link?: string | null
  img?: string | null
}): Promise<PubRow> {
  await ensureSchema()
  const [{ next }] = (await sql`SELECT COALESCE(max(sort_order), 0) + 1 AS next FROM publications`) as {
    next: number
  }[]
  const rows = (await sql`INSERT INTO publications (year, title, authors, venue, link, img, sort_order)
    VALUES (${input.year}, ${input.title}, ${input.authors ?? null}, ${input.venue ?? null},
            ${input.link ?? null}, ${input.img ?? null}, ${next})
    RETURNING id, year, title, authors, venue, link, img, sort_order`) as PubRow[]
  return rows[0]
}

export async function deletePublication(id: number): Promise<void> {
  await ensureSchema()
  await sql`DELETE FROM publications WHERE id = ${id}`
}

// ---------------------------------------------------------------------------

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}
