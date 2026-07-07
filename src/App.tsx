import './App.css'

const focusAreas = [
  'Research overview',
  'People and roles',
  'Publications',
  'Lab updates',
]

const sections = [
  {
    title: 'Research',
    text: 'A place to introduce the lab questions, active projects, methods, and model systems.',
  },
  {
    title: 'Team',
    text: 'Profile cards for trainees, staff, collaborators, and alumni can be added here.',
  },
  {
    title: 'Output',
    text: 'A structured home for publications, presentations, datasets, protocols, and news.',
  },
]

function App() {
  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Thomson Lab Site Demo home">
          <span className="brand-mark" aria-hidden="true" />
          Thomson Lab Site Demo
        </a>
        <div className="nav-links">
          <a href="#research">Research</a>
          <a href="#team">Team</a>
          <a href="#output">Output</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>A clean web home for a modern research lab.</h1>
          <p>
            This starter site is ready for lab identity, research narratives,
            people profiles, publications, and project updates.
          </p>
          <a className="primary-link" href="#research">
            View scaffold
          </a>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="sample-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="trace trace-one" />
          <div className="trace trace-two" />
        </div>
      </section>

      <section className="focus-strip" aria-label="Site focus areas">
        {focusAreas.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="content-grid" id="research">
        {sections.map((section) => (
          <article className="section-card" key={section.title}>
            <h2 id={section.title === 'Team' ? 'team' : section.title === 'Output' ? 'output' : undefined}>
              {section.title}
            </h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
