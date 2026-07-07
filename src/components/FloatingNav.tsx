import { useLayoutEffect, useRef, useState } from 'react'
import './FloatingNav.css'

const NAV_ITEMS = [
  'Home',
  'Research',
  'Publications',
  'Links & Resources',
  'Our Team',
  'Contact Us',
] as const

type NavItem = (typeof NAV_ITEMS)[number]

/** Inner padding of the bar (matches CSS .fnav-pill-wrap top). */
const PAD = 6
/** Height of the yellow pill / active label row (matches CSS heights). */
const PILL_H = 44
/**
 * Even margin between the pill and the dark cradle. Because it is uniform on
 * every side, the cradle's radius stays concentric with the pill's:
 * cradle radius = pill radius (PILL_H/2) + MARGIN. The cradle sits behind the
 * bar background, so only the part below the bar shows as a downward bulge
 * of MARGIN − PAD px.
 */
const MARGIN = 9

type Box = { left: number; width: number }

export default function FloatingNav() {
  const [selected, setSelected] = useState<NavItem>('Home')
  const [mounted, setMounted] = useState(false)
  const [geo, setGeo] = useState<Record<string, Box>>({})
  // Left offset of the tab list within the bar (accounts for the brand logo).
  const [listOffset, setListOffset] = useState(PAD)

  const listRef = useRef<HTMLUListElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<NavItem, HTMLButtonElement>>(new Map())

  const measureAll = () => {
    const list = listRef.current
    const bar = barRef.current
    if (!list || !bar) return
    const lb = list.getBoundingClientRect()
    setListOffset(lb.left - bar.getBoundingClientRect().left)
    const next: Record<string, Box> = {}
    for (const item of NAV_ITEMS) {
      const el = itemRefs.current.get(item)
      if (!el) continue
      const b = el.getBoundingClientRect()
      next[item] = { left: b.left - lb.left, width: b.width }
    }
    setGeo(next)
  }

  useLayoutEffect(() => {
    measureAll()
    const bar = barRef.current
    const ro = bar ? new ResizeObserver(measureAll) : null
    ro?.observe(bar!)
    // Re-measure after layout settles (covers cached images that are already
    // laid out before the observers attach), then reveal the pill.
    const id = requestAnimationFrame(() => {
      measureAll()
      setMounted(true)
    })
    document.fonts?.ready.then(measureAll).catch(() => {})
    return () => {
      cancelAnimationFrame(id)
      ro?.disconnect()
    }
  }, [])

  return (
    <nav className="fnav" aria-label="Primary">
      <div className="fnav-bar" ref={barRef}>
        {/* Dark cradles (one per tab) — sit BEHIND the bar background so only the
            downward bulge is visible. The outgoing one shrinks while the incoming
            one grows, at the same time. */}
        {NAV_ITEMS.map((item) => {
          const box = geo[item]
          const on = mounted && selected === item
          return (
            <span
              key={`cradle-${item}`}
              className="fnav-cradle-wrap"
              aria-hidden="true"
              style={
                box
                  ? {
                      transform: `translateX(${listOffset + box.left - MARGIN}px)`,
                      width: box.width + MARGIN * 2,
                      height: PILL_H + MARGIN * 2,
                      top: PAD - MARGIN,
                    }
                  : undefined
              }
            >
              <span className={`fnav-cradle-fill ${on ? 'is-on' : ''}`} />
            </span>
          )
        })}

        {/* Opaque bar background, above the cradles, below the pills + labels */}
        <div className="fnav-barbg" aria-hidden="true" />

        {/* Brand logo on the far left */}
        <a className="fnav-brand" href="#top" aria-label="Thomson Lab — home">
          <img src="/thomson-logo-light.png" alt="Thomson Lab" onLoad={measureAll} />
        </a>

        {/* Yellow DNA pills (one per tab) */}
        {NAV_ITEMS.map((item) => {
          const box = geo[item]
          const on = mounted && selected === item
          return (
            <span
              key={`pill-${item}`}
              className="fnav-pill-wrap"
              aria-hidden="true"
              style={
                box
                  ? { transform: `translateX(${listOffset + box.left}px)`, width: box.width }
                  : undefined
              }
            >
              <span className={`fnav-pill-fill ${on ? 'is-on' : ''}`} />
            </span>
          )
        })}

        <ul className="fnav-list" ref={listRef}>
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                type="button"
                ref={(node) => {
                  if (node) itemRefs.current.set(item, node)
                  else itemRefs.current.delete(item)
                }}
                className={`fnav-link ${selected === item ? 'is-active' : ''}`}
                aria-current={selected === item ? 'page' : undefined}
                onClick={() => setSelected(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
