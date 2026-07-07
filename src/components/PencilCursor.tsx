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

        // blunt pencil: soft, slightly wide graphite stroke that thins as it fades
        const width = 1.5 + life * 6
        // graphite grit — two slightly offset strokes for a rougher, softer look
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.strokeStyle = `rgba(45,45,45,${0.32 * life})`
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        // grainy core
        ctx.strokeStyle = `rgba(30,30,30,${0.5 * life})`
        ctx.lineWidth = Math.max(0.6, width * 0.45)
        ctx.beginPath()
        ctx.moveTo(a.x + (Math.random() - 0.5) * 1.4, a.y + (Math.random() - 0.5) * 1.4)
        ctx.lineTo(b.x + (Math.random() - 0.5) * 1.4, b.y + (Math.random() - 0.5) * 1.4)
        ctx.stroke()
      }

      // pencil tip dot at the head
      if (mouseInside && pts.length) {
        const h = pts[pts.length - 1]
        ctx.fillStyle = 'rgba(35,35,35,0.55)'
        ctx.beginPath()
        ctx.arc(h.x, h.y, 2.4, 0, Math.PI * 2)
        ctx.fill()
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
