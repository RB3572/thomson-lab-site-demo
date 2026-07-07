import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'

const AREAS = [
  {
    title: 'Active Matter',
    to: '/active-matter',
    img: '/research/active-matter.png',
    text: 'Understanding how complex active matter networks amplify and organize the forces that underlie cell division, motility, and the folding of tissues in development.',
  },
  {
    title: 'Machine Learning',
    to: '/machine-learning',
    img: '/research/machine-learning.png',
    text: 'Developing artificial neural networks that self-organize themselves, growing from single computational cells, just like the brain.',
  },
  {
    title: 'Single-Cell Biology',
    to: '/single-cell',
    img: '/research/single-cell.png',
    text: 'Building predictive models from massive-scale single cell data, then testing them by devising strategies to control and rewire tissue self-organization.',
  },
]

export default function Research() {
  return (
    <PageShell
      title="Research"
      intro="The Thomson Lab investigates biological principles across multiple model systems — studying how cells manipulate matter in time and space to move, divide, and change shape. We combine expertise from biochemistry, computer science, molecular biology, and physics, united by a shared commitment to exploring the principles underlying collective organization and intelligence in biology."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {AREAS.map((a) => (
          <Link
            key={a.title}
            to={a.to}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/70 backdrop-blur-md transition-colors hover:border-[#f7cc34]/60"
          >
            <div className="flex h-44 items-center justify-center bg-white/5 p-4">
              <img
                src={a.img}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-bold text-white">{a.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">
                {a.text}
              </p>
              <span className="mt-4 text-sm font-semibold text-[#f7cc34]">
                Learn more{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
