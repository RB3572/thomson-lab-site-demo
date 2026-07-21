import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import FloatingNav from './components/FloatingNav'
import Footer from './components/Footer'
import AuthErrorBanner from './components/AuthErrorBanner'

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  const landingRef = useRef<HTMLVideoElement>(null)
  const otherRef = useRef<HTMLVideoElement>(null)

  // Take over scroll position from the browser: its automatic restoration can
  // re-apply a previous scroll AFTER our reset, once late assets (the background
  // videos, images) change the page height — which on mobile makes the landing
  // page load already scrolled down.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Start each page at the top (matters for the scroll-driven pages).
  useEffect(() => {
    window.scrollTo(0, 0)
    // Re-assert top on the landing page after assets load and shift layout.
    if (!isLanding) return
    const toTop = () => window.scrollTo(0, 0)
    const raf = requestAnimationFrame(toTop)
    window.addEventListener('load', toTop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', toTop)
    }
  }, [pathname, isLanding])

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
    'site-bg-video fixed inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ease-in-out'

  return (
    // Flex column + flex-1 content keeps the footer at the bottom on short
    // pages, so no background shows below it.
    <div className="relative flex min-h-screen flex-col text-white">
      {/* Cell-field background. On mobile it's the background everywhere (the
          logo build video crops too hard on a tall screen). On desktop it
          crossfades with the logo video on the landing page. */}
      <video
        ref={otherRef}
        className={`${videoClass} site-bg-video--cells opacity-100 ${isLanding ? 'md:opacity-0' : 'md:opacity-100'}`}
        autoPlay
        muted
        loop
        playsInline
        poster="/landing-poster.jpg"
      >
        <source src="/landing-animation.mp4" type="video/mp4" />
      </video>
      {/* Landing-only "logo build" background — desktop only, crossfades in/out */}
      <video
        ref={landingRef}
        className={`${videoClass} site-bg-video--logo hidden md:block ${isLanding ? 'md:opacity-100' : 'md:opacity-0'}`}
        autoPlay
        muted
        loop
        playsInline
        poster="/landing-logo-poster.jpg"
      >
        <source src="/landing-logo.mp4" type="video/mp4" />
      </video>

      {/* Gentle darkening for consistent contrast under the glass */}
      <div className="site-bg-scrim fixed inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

      <AuthErrorBanner />
      <FloatingNav />
      <div className="app-content flex-1">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
