import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import FloatingNav from './components/FloatingNav'
import Footer from './components/Footer'

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  const landingRef = useRef<HTMLVideoElement>(null)
  const otherRef = useRef<HTMLVideoElement>(null)

  // Start each page at the top (matters for the scroll-driven pages).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Crossfade to the SAME frame: sync the incoming video's time to the outgoing
  // one before the opacity transition, so the dissolve feels seamless. Both
  // clips are the same length (~11.9s boomerangs), so the time maps 1:1.
  useEffect(() => {
    const incoming = isLanding ? landingRef.current : otherRef.current
    const outgoing = isLanding ? otherRef.current : landingRef.current
    if (incoming && outgoing) {
      const t = outgoing.currentTime
      if (Number.isFinite(t)) {
        try {
          incoming.currentTime = t
        } catch {
          /* seeking may be briefly unavailable; ignore */
        }
      }
      void incoming.play?.().catch(() => {})
    }
  }, [isLanding])

  const videoClass =
    'fixed inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ease-in-out'

  return (
    <div className="relative min-h-screen text-white">
      {/* Background for non-landing pages (cell field) */}
      <video
        ref={otherRef}
        className={`${videoClass} ${isLanding ? 'opacity-0' : 'opacity-100'}`}
        autoPlay
        muted
        loop
        playsInline
        poster="/landing-poster.jpg"
      >
        <source src="/landing-animation.mp4" type="video/mp4" />
      </video>
      {/* Landing-only background (logo build) — sits on top, crossfades in/out */}
      <video
        ref={landingRef}
        className={`${videoClass} ${isLanding ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted
        loop
        playsInline
        poster="/landing-logo-poster.jpg"
      >
        <source src="/landing-logo.mp4" type="video/mp4" />
      </video>

      {/* Gentle darkening for consistent contrast under the glass */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

      <FloatingNav />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  )
}
