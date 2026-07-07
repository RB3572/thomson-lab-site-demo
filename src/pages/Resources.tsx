import PageShell from '@/components/PageShell'

type ResLink = { label: string; href: string }
const RESOURCES: { title: string; text: string; links: ResLink[] }[] = [
  {
    title: 'HERD — Model Router',
    text: 'An open-source language-model routing system that matches ChatGPT-level accuracy using smaller composite models at reduced computational cost — addressing queries that proprietary models fail to handle, at roughly 2.5× the efficiency.',
    links: [
      { label: 'Try the router', href: 'https://router.herd-ai.com/' },
      { label: 'Read the paper', href: 'https://arxiv.org/abs/2310.19902' },
    ],
  },
  {
    title: 'ActiveSVM — Gene Set Discovery',
    text: 'An active-learning method for identifying minimal yet informative gene sets to classify cell types, states, and perturbations in single-cell genomic data — reaching ~90% accuracy while reducing measurement costs 10–100 fold.',
    links: [
      {
        label: 'Nature Computational Science',
        href: 'https://www.nature.com/articles/s43588-022-00263-8',
      },
    ],
  },
  {
    title: 'TRILL — Protein Design Platform',
    text: 'An integrated system for protein discovery leveraging advanced deep-learning models (ESM-2, DiffDock, RFDiffusion) to generate novel proteins, predict structures, extract representations, and classify function.',
    links: [
      { label: 'Documentation', href: 'https://trill.readthedocs.io/en/latest/home.html' },
      {
        label: 'Preprint',
        href: 'https://www.biorxiv.org/content/10.1101/2023.10.24.563881v2',
      },
    ],
  },
  {
    title: 'YouTube Channel',
    text: 'Talks, tutorials, and recordings from the Thomson Lab.',
    links: [
      { label: 'Watch on YouTube', href: 'https://www.youtube.com/@thomsonlab4932/videos' },
    ],
  },
]

export default function Resources() {
  return (
    <PageShell
      title="Links & Resources"
      intro="A curated collection of open-source tools and research outputs from the Thomson Lab."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {RESOURCES.map((r) => (
          <article
            key={r.title}
            className="flex flex-col rounded-2xl border border-white/10 bg-[#0b0c10]/70 p-7 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold text-white">{r.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">
              {r.text}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {r.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-[#f7cc34] hover:text-[#f7cc34]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
