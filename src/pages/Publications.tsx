import PageShell from '@/components/PageShell'
import { publications } from '@/lib/publications'

export default function Publications() {
  return (
    <PageShell
      title="Publications"
      intro="Selected papers and preprints from the Thomson Lab, spanning active matter, single-cell biology, and machine learning."
    >
      <div className="space-y-14">
        {publications.map((group) => (
          <section key={group.year}>
            <div className="mb-5 flex items-center gap-4">
              <h2 className="text-2xl font-bold text-[#f7cc34]">{group.year}</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <ul className="space-y-4">
              {group.items.map((pub) => (
                <li
                  key={pub.title}
                  className="rounded-xl border border-white/10 bg-[#0b0c10]/70 p-5 backdrop-blur-md transition-colors hover:border-white/25"
                >
                  {pub.link ? (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-semibold text-white underline-offset-4 hover:underline"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    <span className="text-base font-semibold text-white">
                      {pub.title}
                    </span>
                  )}
                  <p className="mt-1.5 text-sm text-white/60">{pub.authors}</p>
                  <p className="mt-1 text-sm font-medium text-white/80">
                    {pub.venue}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
