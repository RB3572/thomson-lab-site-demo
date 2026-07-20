import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSession } from './session'
import { isAdminEmail } from './config'
import { getMemberEmails } from './db'
import { sendJson } from './http'

export async function getAuthedEmail(req: VercelRequest): Promise<string | null> {
  const s = await getSession(req)
  return s?.email ?? null
}

/** Admins + any lab member whose email is on file may enter the secure area. */
export async function isAllowlisted(email: string): Promise<boolean> {
  if (isAdminEmail(email)) return true
  const emails = await getMemberEmails()
  return emails.includes(email.toLowerCase())
}

/** Returns the admin's email, or writes 401/403 and returns null. */
export async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
): Promise<string | null> {
  const email = await getAuthedEmail(req)
  if (!email) {
    sendJson(res, 401, { error: 'not_authenticated' })
    return null
  }
  if (!isAdminEmail(email)) {
    sendJson(res, 403, { error: 'not_authorized' })
    return null
  }
  return email
}

/** Returns an allowlisted email, or writes 401/403 and returns null. */
export async function requireAllowlisted(
  req: VercelRequest,
  res: VercelResponse,
): Promise<string | null> {
  const email = await getAuthedEmail(req)
  if (!email) {
    sendJson(res, 401, { error: 'not_authenticated' })
    return null
  }
  if (!(await isAllowlisted(email))) {
    sendJson(res, 403, { error: 'not_authorized' })
    return null
  }
  return email
}
