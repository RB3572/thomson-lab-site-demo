import { useEffect, useState } from 'react'
import { CardStack } from '@/components/ui/glass-cards'
import { team as staticTeam, type TeamSection } from '@/lib/team'
import { fetchJson } from '@/lib/api'

export default function OurTeam() {
  // Show the bundled roster immediately; swap in live data (with admin edits)
  // once the API responds. Falls back to static if the API/DB is unavailable.
  const [team, setTeam] = useState<TeamSection[]>(staticTeam)
  useEffect(() => {
    fetchJson<{ sections: TeamSection[] }>('/api/members').then((d) => {
      if (d?.sections?.length) setTeam(d.sections)
    })
  }, [])

  return (
    <main className="relative">
      {/* Page hero */}
      <section className="flex h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          Our Team
        </h1>
        <p className="max-w-2xl text-lg text-white/75 sm:text-xl">
          The people exploring principles of self-organization and collective
          intelligence in biology.
        </p>
        <div className="mt-2 flex flex-col items-center gap-1 text-white/60">
          <span className="text-sm">Scroll to meet the lab</span>
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

      {team.map((section) => (
        <CardStack key={section.id} section={section} />
      ))}

      <div className="h-[8vh]" />
    </main>
  )
}
