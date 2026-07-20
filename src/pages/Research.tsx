import { Link } from 'react-router-dom'
import InstitutionalShell, { InstSection } from '@/components/InstitutionalShell'

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
    <InstitutionalShell
      title="Research"
      intro="The Thomson Lab investigates biological principles across multiple model systems — studying how cells manipulate matter in time and space to move, divide, and change shape. We combine expertise from biochemistry, computer science, molecular biology, and physics, united by a shared commitment to exploring the principles underlying collective organization and intelligence in biology."
    >
      <InstSection label="Areas of Research" heading="Research Programs" tone="warm">
        <div className="grid gap-6 md:grid-cols-3">
          {AREAS.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="group inst-card flex flex-col transition-colors"
            >
              {/* Formal figure plate — white frame, thin neutral border */}
              <div
                className="flex h-44 items-center justify-center bg-white p-4"
                style={{ borderBottom: '1px solid var(--inst-border)' }}
              >
                <img
                  src={a.img}
                  alt=""
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="inst-serif text-xl">{a.title}</h3>
                <p className="inst-muted mt-3 flex-1 text-[0.95rem] leading-relaxed">
                  {a.text}
                </p>
                <span className="inst-link mt-5 text-sm">
                  Explore{' '}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </InstSection>

      <InstSection label="Approach" heading="How We Work">
        <div className="max-w-3xl space-y-5 text-[1.02rem] leading-relaxed">
          <p className="inst-muted">
            We formulate predictive mathematical models using high-dimensional
            data, then apply those models to reprogram and engineer biological
            systems to achieve new behaviors. Recent work has focused on
            cytoskeletal active matter and cellular self-organization in neural
            circuit development.
          </p>
          <p className="inst-muted">
            Our goal is to understand how unexplained properties of biological
            systems — including their mechanical organization and their ability
            to process information — emerge from collective interactions across
            molecular, cellular, and organismal scales.
          </p>
        </div>
      </InstSection>
    </InstitutionalShell>
  )
}
