import { PaperTexture } from '@/components/ui/paper-texture'
import PencilCursor from '@/components/PencilCursor'
import { publications } from '@/lib/publications'

const PAPER = {
  fit: 'cover' as const,
  scale: 1.1,
  speed: 0,
  frame: 0,
  colorBack: '#f9f4e8',
  colorFront: '#e7ddc7',
  contrast: 0.32,
  roughness: 0.55,
  fiber: 0.35,
  fiberSize: 0.2,
  crumples: 0.22,
  crumpleSize: 0.32,
  folds: 0.18,
  foldCount: 4,
  fade: 0,
  drops: 0.05,
  seed: 12,
}

/** Two-corner tape combos, each guaranteed at least one top corner. */
const TAPE_COMBOS = [
  ['tape-tl', 'tape-tr'], // both top
  ['tape-tr', 'tape-bl'], // top-right + bottom-left
  ['tape-tl', 'tape-br'], // top-left + bottom-right
  ['tape-tr', 'tape-br'], // top-right + bottom-right
  ['tape-tl', 'tape-bl'], // top-left + bottom-left
] as const

/** Stable hash of a string so a figure keeps the same tape layout across renders. */
function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export default function Publications() {
  let figIdx = 0
  return (
    <div className="notebook relative min-h-screen text-[#38352d] md:-mt-[82px]">
      {/* Paper sheet (covers the site's animated background). Solid cream sits
          behind the shader so the sheet is never blank if WebGL is unavailable. */}
      <div
        className="fixed inset-0 -z-[3]"
        style={{ background: '#f9f4e8' }}
        aria-hidden="true"
      >
        <PaperTexture {...PAPER} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Pencil trail */}
      <PencilCursor />

      {/* Full-width sheet so the ruled lines run edge to edge; pt clears the
          floating nav (the page is pulled up so the rules start at the top). */}
      <main className="notebook-sheet relative min-h-screen w-full pb-40 pt-[68px] md:pt-[170px]">
        {/* punched holes down the left edge */}
        <div className="notebook-hole" style={{ top: '150px' }} />
        <div className="notebook-hole" style={{ top: '390px' }} />
        <div className="notebook-hole" style={{ top: '630px' }} />

        {/* writing area — left-justified against the red margin line */}
        <div
          className="max-w-[1120px] pr-8"
          style={{ paddingLeft: 'calc(var(--margin) + 20px)' }}
        >
          <h1 className="font-title pencil text-[42px] leading-[68px] md:text-[64px]">
            Publications
          </h1>

          {publications.map((group) => (
            <section key={group.year} className="mt-[34px]">
              <h2 className="font-title pencil text-[28px] leading-[68px] md:text-[40px]">
                {group.year}
              </h2>

              {group.items.map((pub) => {
                const rot = figIdx % 2 === 0 ? -2.2 : 2.4
                figIdx += 1
                const [tapeA, tapeB] =
                  TAPE_COMBOS[hash(pub.title) % TAPE_COMBOS.length]
                return (
                  <article
                    key={pub.title}
                    className="mb-[34px] clear-both"
                  >
                    {pub.img && (
                      <figure
                        className="taped float-right mb-3 ml-4 w-[112px] md:ml-6 md:w-[190px]"
                        style={{ transform: `rotate(${rot}deg)` }}
                      >
                        <span className={`tape ${tapeA}`} />
                        <span className={`tape ${tapeB}`} />
                        <img src={pub.img} alt="" loading="lazy" />
                      </figure>
                    )}

                    {pub.link ? (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-hand pencil text-[17px] font-bold leading-[34px] md:text-[21px] decoration-[#38352d]/50 hover:underline"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      <span className="font-hand pencil text-[17px] font-bold leading-[34px] md:text-[21px]">
                        {pub.title}
                      </span>
                    )}

                    {pub.authors && (
                      <p className="font-hand pencil-soft text-[15px] leading-[34px] md:text-[18px]">
                        {pub.authors}
                      </p>
                    )}
                    <p className="font-hand pencil-soft text-[15px] italic leading-[34px] md:text-[18px]">
                      {pub.venue}
                    </p>
                  </article>
                )
              })}
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
