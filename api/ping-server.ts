import { ADMIN_EMAILS } from '../server/config'
export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true, probe: 'server/config', adminCount: ADMIN_EMAILS.length,
    hasGOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    hasGOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    hasSESSION_SECRET: !!process.env.SESSION_SECRET,
  })
}
