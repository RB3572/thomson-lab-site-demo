import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { LiquidGlassCard } from '@/components/ui/liquid-weather-glass'
import ThumbnailCarousel from '@/components/ui/thumbnail-carousel'

export default function Home() {
  const introRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ['start end', 'center center'],
  })
  const cardY = useTransform(scrollYProgress, [0, 1], [70, 0])
  // Reveal via a fading scrim rather than the card's own opacity: animating
  // opacity on an ancestor of a backdrop-filter element makes the blur snap in
  // at opacity 1. Keeping the card fully opaque and fading a cover over it gives
  // a smooth, gradual reveal.
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <>
      {/* Hero — the animation is the whole background here */}
      <section className="relative flex h-[92vh] flex-col items-center justify-end pb-16">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-sm font-medium tracking-wide">Scroll to explore</span>
          <svg
            className="h-6 w-6 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* Intro — glass card rises from the bottom over the animation */}
      <section
        ref={introRef}
        className="relative flex min-h-screen items-center justify-center px-4 pb-28 pt-4"
      >
        <motion.div
          style={{ y: cardY }}
          className="relative w-[min(1120px,94vw)]"
        >
          <LiquidGlassCard
            draggable={false}
            blurIntensity="xl"
            glowIntensity="md"
            shadowIntensity="sm"
            borderRadius="28px"
            className="flex min-h-[86vh] w-full items-center bg-white/10 px-7 py-16 sm:px-16 sm:py-20"
          >
            <div className="mx-auto max-w-3xl">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                Thomson Lab
              </h1>
              <p className="mt-3 text-xl font-medium text-[#f7cc34] sm:text-2xl">
                The laboratory of living algorithms
              </p>
              <p className="mt-7 text-lg font-medium leading-relaxed text-white/95 sm:text-xl">
                Applying quantitative experimental and modeling approaches to
                explain, predict, and program biological systems.
              </p>
              <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
                From cell-division to brain development, biological systems
                accomplish tasks through self-organization across molecular,
                cellular and organismal scales. Our goal is to understand how
                unexplained properties of biological systems, including their
                mechanical organization and their ability to process
                information, emerge from collective interactions. The Thomson lab
                investigates basic principles of self-organization and collective
                behavior in biological systems. We formulate predictive
                mathematical models using high-dimensional data. We apply models
                to reprogram and engineer biological systems to achieve new
                behaviors.
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                To uncover new scientific principles, we work across biological
                model systems. Recent work has focused on systems including
                cytoskeletal active matter and cellular self-organization in
                neural circuit development. We apply tools from biochemistry,
                computer science, molecular biology, and physics. We are united
                in our goal to explore principles underlying collective
                organization and intelligence in biology and to reengineer
                biological systems ranging from cells to organisms.
              </p>
            </div>
          </LiquidGlassCard>

          {/* Fading cover — reveals the (always-opaque) glass card smoothly */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: scrimOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-[#05060a]"
          />
        </motion.div>
      </section>

      {/* Image carousel */}
      <section className="relative px-4 pb-28 pt-4">
        <ThumbnailCarousel />
      </section>
    </>
  )
}
