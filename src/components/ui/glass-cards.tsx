import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Member, TeamSection } from '@/lib/team'

gsap.registerPlugin(ScrollTrigger)

/** How many cards behind the front one stay visibly fanned (keeps big stacks bounded). */
const MAX_FAN = 3

function initials(name: string) {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface CardProps {
  member: Member
  index: number
  total: number
  /** rgba(...,0.8) for the highlighted (PI) card, or null for a neutral card. */
  accent: string | null
}

const MemberCard = ({ member, index, total, accent }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const container = containerRef.current
    if (!card || !container) return

    // Dynamic, BOUNDED stacking: as each card gets covered it settles at a fixed
    // small scale + upward nudge (never accumulates with total count), so even a
    // 19-card stack stays on screen and readable.
    gsap.set(card, { scale: 1, y: 0, transformOrigin: 'center center' })
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(card, {
          scale: gsap.utils.interpolate(1, 0.9, p),
          y: gsap.utils.interpolate(0, -26, p),
        })
      },
    })

    return () => {
      st.kill()
    }
  }, [index, total])

  // A small, capped fan so a few card edges peek behind the front one.
  const fan = Math.min(total - 1 - index, MAX_FAN)

  const accentSolid = accent ? accent.replace('0.8', '1') : null
  const roleColor = accentSolid ?? 'rgba(255,255,255,0.72)'
  const avatarBg = accent
    ? accent.replace('0.8', '0.18')
    : 'rgba(255,255,255,0.08)'
  const boxShadow = accent
    ? `0 10px 34px rgba(0,0,0,0.4), 0 0 34px ${accent.replace(
        '0.8',
        '0.22',
      )}, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)`
    : '0 10px 34px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.1)'

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex h-screen items-center justify-center"
    >
      <div
        ref={cardRef}
        className="relative h-[480px] w-[92%] max-w-4xl sm:h-[440px]"
        style={{ borderRadius: '24px', isolation: 'isolate', top: `${-fan * 7}px` }}
      >
        {/* Accent border — a masked gradient RING, only for the highlighted card */}
        {accent && (
          <div
            style={{
              position: 'absolute',
              inset: '-1px',
              borderRadius: '25px',
              padding: '2px',
              background: `conic-gradient(from 0deg, transparent 0deg, ${accent} 60deg, ${accent.replace(
                '0.8',
                '0.6',
              )} 120deg, transparent 180deg, ${accent.replace(
                '0.8',
                '0.4',
              )} 240deg, transparent 360deg)`,
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        )}

        {/* Glass body */}
        <div
          className="team-card relative h-full w-full overflow-hidden"
          style={{
            borderRadius: '24px',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)), rgba(14,14,14,0.34)',
            backdropFilter: 'blur(22px) saturate(150%)',
            WebkitBackdropFilter: 'blur(22px) saturate(150%)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow,
          }}
        >
          {/* top reflection */}
          <div
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              height: '60%',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
              pointerEvents: 'none',
              borderRadius: '24px 24px 0 0',
            }}
          />
          {/* shine line */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: '2px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center gap-5 p-6 text-center sm:flex-row sm:gap-8 sm:p-9 sm:text-left">
            {/* Square photo — matches the (mostly square) source images so faces
                aren't cropped into a thin band */}
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                loading="lazy"
                className="h-40 w-40 shrink-0 rounded-2xl object-cover object-top shadow-lg ring-1 ring-white/15 sm:h-56 sm:w-56"
              />
            ) : (
              <div
                className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl text-5xl font-semibold text-white/85 ring-1 ring-white/15 sm:h-56 sm:w-56"
                style={{ background: avatarBg }}
              >
                {initials(member.name)}
              </div>
            )}

            <div className="flex flex-col justify-center gap-3">
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                {member.name}
              </h3>
              <p
                className="text-sm font-semibold sm:text-[0.95rem]"
                style={{ color: roleColor }}
              >
                {member.role}
              </p>
              {member.areas && member.areas.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {member.areas.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/85"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
              {member.focus && (
                <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                  {member.focus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardStack({ section }: { section: TeamSection }) {
  // Only the Principal Investigator keeps a colored accent; everyone else is neutral.
  const accent = section.id === 'pi' ? section.color : null

  return (
    <section id={section.id} className="relative">
      {/* Section intro */}
      <div className="flex h-[46vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          {section.title}
        </h2>
      </div>

      {/* Stacked cards */}
      <div className="relative">
        {section.members.map((member, index) => (
          <MemberCard
            key={member.name}
            member={member}
            index={index}
            total={section.members.length}
            accent={accent}
          />
        ))}
      </div>
    </section>
  )
}
