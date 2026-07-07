import PageShell from '@/components/PageShell'

const AREAS = [
  {
    title: 'Active Matter',
    img: '/research/active-matter.png',
    text: 'We examine cellular self-organization through defined systems built from purified proteins, studying the self-organization of force and motion in cells to understand how cell-like behaviors emerge from minimal molecular components.',
  },
  {
    title: 'Machine Learning',
    img: '/research/machine-learning.png',
    text: 'We develop bio-inspired algorithms that grow neural networks autonomously — building artificial computational devices from a single unit that are scalable, robust, energy-efficient, and adaptable without human intervention.',
  },
  {
    title: 'Single-Cell Biology',
    img: '/research/single-cell.png',
    text: 'We investigate how complex regulatory networks let individual cells respond to their environment, developing machine-learning approaches that automate the scientific method for closed-loop learning of regulatory network models.',
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
          <article
            key={a.title}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c10]/70 backdrop-blur-md"
          >
            <div className="flex h-44 items-center justify-center bg-white/5 p-4">
              <img
                src={a.img}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">{a.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {a.text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
