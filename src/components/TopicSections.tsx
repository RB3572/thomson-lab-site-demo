export interface TopicBlock {
  heading: string
  paras?: string[]
  list?: string[]
  img?: string
}

export function TopicSections({ blocks }: { blocks: TopicBlock[] }) {
  return (
    <div className="space-y-20">
      {blocks.map((b, i) => {
        const hasImg = !!b.img
        const flip = i % 2 === 1
        return (
          <section
            key={b.heading}
            className={`grid gap-8 ${hasImg ? 'md:grid-cols-2 md:items-center' : ''}`}
          >
            <div className={hasImg && flip ? 'md:order-2' : ''}>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {b.heading}
              </h2>
              {b.paras?.map((p, j) => (
                <p key={j} className="mt-4 leading-relaxed text-white/75">
                  {p}
                </p>
              ))}
              {b.list && (
                <ul className="mt-4 space-y-2.5">
                  {b.list.map((li) => (
                    <li key={li} className="flex gap-3 text-white/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7cc34]" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {hasImg && (
              <div className={flip ? 'md:order-1' : ''}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-4 shadow-lg">
                  <img
                    src={b.img}
                    alt=""
                    loading="lazy"
                    className="mx-auto max-h-72 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
