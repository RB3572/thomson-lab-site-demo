import { useEffect, useRef } from 'react'

interface Pt {
  x: number
  y: number
  t: number
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

    const LIFE = 550 // ms a point stays before it fully fades
    let pts: Pt[] = []
    let mouseInside = false

    const onMove = (e: MouseEvent) => {
      mouseInside = true
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() })
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
        const a = pts[i - 1]
        const b = pts[i]
        const age = now - b.t
        const life = 1 - age / LIFE // 1 -> 0
        if (life <= 0) continue

        // Light graphite pencil: instead of a solid line, scatter faint
        // graphite specks along the segment so it reads as grainy pencil shading.
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 1
        // unit perpendicular for lateral grain spread
        const px = -dy / dist
        const py = dx / dist
        // half-width of the stroke (thins as it fades)
        const halfW = 0.8 + life * 2.4
        // grain density scales with length + width
        const specks = Math.max(2, Math.floor(dist * (0.7 + life)))

        for (let s = 0; s < specks; s++) {
          const t = Math.random()
          // gaussian-ish lateral offset (denser toward the centre)
          const off =
            (Math.random() - 0.5 + (Math.random() - 0.5)) * halfW
          const gx = a.x + dx * t + px * off
          const gy = a.y + dy * t + py * off
          const size = 0.5 + Math.random() * 0.9
          // light graphite, faint and randomised for texture
          const alpha = life * (0.05 + Math.random() * 0.13)
          ctx.fillStyle = `rgba(78,72,62,${alpha})`
          ctx.fillRect(gx, gy, size, size)
        }
      }

      // soft pencil tip at the head
      if (mouseInside && pts.length) {
        const h = pts[pts.length - 1]
        for (let s = 0; s < 10; s++) {
          const ang = Math.random() * Math.PI * 2
          const rad = Math.random() * 2.2
          ctx.fillStyle = `rgba(80,74,64,${0.06 + Math.random() * 0.12})`
          ctx.fillRect(h.x + Math.cos(ang) * rad, h.y + Math.sin(ang) * rad, 0.9, 0.9)
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
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  )
}
