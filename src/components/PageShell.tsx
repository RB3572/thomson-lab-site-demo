import type { ReactNode } from 'react'

export default function PageShell({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <>
      {/* Extra darkening so long-form content reads well over the video */}
      <div aria-hidden="true" className="fixed inset-0 -z-[5] bg-black/60" />
      <main className="relative mx-auto max-w-5xl px-6 pb-28 pt-14 sm:pt-20">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
              {intro}
            </p>
          )}
        </header>
        {children}
      </main>
    </>
  )
}
