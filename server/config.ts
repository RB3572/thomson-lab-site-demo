/** Server-only configuration for the Vercel Functions under /api. */

/** Emails allowed into the admin console. Override with ADMIN_EMAILS (comma-sep). */
export const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ?? 'rishi.bhargav@gmail.com,rbhargav@caltech.edu'
)
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

/** The Caltech shared-assets Drive folder, returned only to allowlisted users. */
export const SECURE_DRIVE_URL =
  process.env.SECURE_DRIVE_URL ??
  'https://drive.google.com/drive/folders/1BxogjHqLs1fC6wi9jX6YTsIqpllGJ3uV?usp=sharing'

export const SESSION_COOKIE = 'tl_session'
export const STATE_COOKIE = 'tl_oauth_state'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}

export function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}
