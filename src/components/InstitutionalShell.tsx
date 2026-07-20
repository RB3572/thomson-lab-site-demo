import type { ReactNode } from 'react'

/**
 * White, Caltech-style academic page shell: institutional masthead, editorial
 * serif title, and generous spacing. Opaque so it fully covers the site's
 * animated background, and theme-fixed (same in light and dark mode).
 */
export default function InstitutionalShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  /** Small uppercase label above the title, e.g. "Thomson Lab". */
  eyebrow?: string
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <>
      {/* Opaque backdrop so the animated video never shows through */}
      <div aria-hidden="true" className="fixed inset-0 -z-[5] bg-white" />

      <div className="inst relative min-h-full">
        {/* Masthead */}
        <header style={{ borderBottom: '1px solid var(--inst-border)' }}>
          <div className="mx-auto max-w-[1180px] px-6 pb-12 pt-12 sm:px-10 sm:pb-16 sm:pt-16">
            <p className="inst-label">{eyebrow ?? 'Thomson Lab'}</p>
            <h1 className="inst-serif mt-4 text-4xl leading-[1.1] sm:text-5xl">
              {title}
            </h1>
            {intro && (
              <p className="inst-muted mt-6 max-w-2xl text-[1.05rem] leading-relaxed">
                {intro}
              </p>
            )}
          </div>
        </header>

        {children}
      </div>
    </>
  )
}

/**
 * A full-bleed content band. `tone="warm"` gives the alternating off-white
 * background used to separate sections without heavy card containers.
 */
export function InstSection({
  label,
  heading,
  tone = 'plain',
  children,
  compact = false,
}: {
  label?: string
  heading?: string
  tone?: 'plain' | 'warm'
  children: ReactNode
  compact?: boolean
}) {
  return (
    <section className={tone === 'warm' ? 'inst-band' : ''}>
      <div
        className={`mx-auto max-w-[1180px] px-6 sm:px-10 ${
          compact ? 'py-10 sm:py-12' : 'py-14 sm:py-20'
        }`}
      >
        {label && <p className="inst-label">{label}</p>}
        {heading && (
          <h2 className="inst-serif mt-3 text-2xl sm:text-3xl">{heading}</h2>
        )}
        <div className={label || heading ? 'mt-8' : ''}>{children}</div>
      </div>
    </section>
  )
}
