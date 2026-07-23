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

  // What actually shipped in the function bundle?
  try {
    const fs = await import('node:fs')
    const ls = (p: string) => {
      try {
        return fs.readdirSync(p).slice(0, 40)
      } catch (e: any) {
        return `ERR ${e?.code}`
      }
    }
    out.fs = {
      '/var/task': ls('/var/task'),
      '/var/task/api': ls('/var/task/api'),
      '/var/task/server': ls('/var/task/server'),
      '/var/task/src': ls('/var/task/src'),
    }
  } catch (e: any) {
    out.fs = String(e?.message)
  }

  const checks: [string, () => Promise<unknown>][] = [
    ['extensionless ../server/config', () => import('../server/config.js')],
    ['with .js ../server/config.js', () => import('../server/config.js')],
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
