import InstitutionalShell, { InstSection } from '@/components/InstitutionalShell'

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

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  )
}

export default function Resources() {
  return (
    <InstitutionalShell
      title="Links & Resources"
      intro="A curated collection of open-source tools and research outputs from the Thomson Lab."
    >
      <InstSection label="Open Source" heading="Tools & Outputs" tone="warm">
        <div className="grid gap-6 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <article key={r.title} className="inst-card flex flex-col p-7">
              <h3 className="inst-serif text-xl">{r.title}</h3>
              <p className="inst-muted mt-3 flex-1 text-[0.95rem] leading-relaxed">
                {r.text}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {r.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inst-btn ${
                      i === 0 ? 'inst-btn-primary' : 'inst-btn-secondary'
                    }`}
                  >
                    {l.label}
                    <ExternalIcon />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </InstSection>
    </InstitutionalShell>
  )
}
