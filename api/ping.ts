// Diagnostic probe: zero imports. If this fails, the function runtime itself is broken.
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, probe: 'bare', node: process.version })
}
