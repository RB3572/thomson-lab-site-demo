import { neon } from '@neondatabase/serverless'
export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true, probe: 'neon', typeofNeon: typeof neon,
    hasDATABASE_URL: !!process.env.DATABASE_URL,
    hasPOSTGRES_URL: !!process.env.POSTGRES_URL,
  })
}
