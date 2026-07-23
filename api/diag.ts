// Self-diagnosing probe. Deliberately has NO static imports, so the function
// always loads; each dependency is imported dynamically inside try/catch so the
// real module-resolution error is reported instead of crashing the function.
export default async function handler(_req: any, res: any) {
  const out: Record<string, unknown> = {
    node: process.version,
    cwd: process.cwd(),
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      SESSION_SECRET: !!process.env.SESSION_SECRET,
    },
  }

  const checks: [string, () => Promise<unknown>][] = [
    ['jose', () => import('jose')],
    ['@neondatabase/serverless', () => import('@neondatabase/serverless')],
    ['../server/config', () => import('../server/config')],
    ['../server/http', () => import('../server/http')],
    ['../server/session', () => import('../server/session')],
    ['../server/google', () => import('../server/google')],
    ['../server/db', () => import('../server/db')],
    ['../src/lib/events', () => import('../src/lib/events')],
  ]

  for (const [name, load] of checks) {
    try {
      await load()
      out[name] = 'OK'
    } catch (e: any) {
      out[name] = `${e?.code ?? 'ERR'}: ${String(e?.message ?? e).slice(0, 240)}`
    }
  }

  res.status(200).json(out)
}
