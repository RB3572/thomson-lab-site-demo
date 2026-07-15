import { useEffect, useRef } from 'react'

interface Speck {
  x: number
  y: number
  size: number
  /** per-speck alpha multiplier (baked once so the grain never shimmers) */
  a: number
}

interface Pt {
  x: number
  y: number
  t: number
  /** graphite grain for the segment ending at this point — computed ONCE */
  specks: Speck[]
}

/** A graphite "blunt pencil" trail that follows the mouse and fades with time. */
export default function PencilCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const LIFE = 700 // ms a point stays before it fully fades
    let pts: Pt[] = []
    let mouseInside = false

    const onMove = (e: MouseEvent) => {
      mouseInside = true
      const b = { x: e.clientX, y: e.clientY, t: performance.now(), specks: [] as Speck[] }
      const a = pts[pts.length - 1]
      if (a) {
        // Bake the grain for the segment a->b ONCE, at fixed positions, so the
        // stroke stays put after it's drawn (only its alpha fades over time).
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 1
        const px = -dy / dist
        const py = dx / dist
        const halfW = 3.6 // lateral grain spread (constant; stroke no longer thins by re-scatter)
        const specks = Math.max(3, Math.floor(dist * 2))
        for (let s = 0; s < specks; s++) {
          const t = Math.random()
          const off = (Math.random() - 0.5 + (Math.random() - 0.5)) * halfW
          b.specks.push({
            x: a.x + dx * t + px * off,
            y: a.y + dy * t + py * off,
            size: 0.6 + Math.random() * 1.1,
            a: 0.16 + Math.random() * 0.26,
          })
        }
      }
      pts.push(b)
      // cap length
      if (pts.length > 120) pts = pts.slice(-120)
    }
    const onLeave = () => {
      mouseInside = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)

    let raf = 0
    const draw = () => {
      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts = pts.filter((p) => now - p.t < LIFE)

      for (let i = 1; i < pts.length; i++) {
        const b = pts[i]
        const age = now - b.t
        const life = 1 - age / LIFE // 1 -> 0
        if (life <= 0) continue

        // Render the pre-baked grain: fixed positions, only the alpha fades.
        // This keeps the drawn stroke perfectly still (no shimmer/vibration).
        for (let s = 0; s < b.specks.length; s++) {
          const g = b.specks[s]
          ctx.fillStyle = `rgba(54,49,42,${life * g.a})`
          ctx.fillRect(g.x, g.y, g.size, g.size)
        }
      }

      // soft pencil tip at the head
      if (mouseInside && pts.length) {
        const h = pts[pts.length - 1]
        for (let s = 0; s < 16; s++) {
          const ang = Math.random() * Math.PI * 2
          const rad = Math.random() * 2.6
          ctx.fillStyle = `rgba(50,45,39,${0.14 + Math.random() * 0.2})`
          ctx.fillRect(h.x + Math.cos(ang) * rad, h.y + Math.sin(ang) * rad, 1, 1)
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1]"
    />
  )
}
