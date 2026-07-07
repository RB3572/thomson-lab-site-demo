import { Link } from 'react-router-dom'

type FooterLink = { label: string; to?: string; href?: string }

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Research',
    links: [
      { label: 'Overview', to: '/research' },
      { label: 'Active Matter', to: '/active-matter' },
      { label: 'Machine Learning', to: '/machine-learning' },
      { label: 'Single-Cell', to: '/single-cell' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Publications', to: '/publications' },
      { label: 'Our Team', to: '/our-team' },
      { label: 'Resources', to: '/resources' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Institutional',
    links: [
      { label: 'Caltech', href: 'https://www.caltech.edu' },
      {
        label: 'Division of Biology and Biological Engineering',
        href: 'https://www.bbe.caltech.edu',
      },
    ],
  },
]

const linkClass =
  'text-[#b4b4b4] transition-colors hover:text-white focus-visible:text-white'

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.href) {
    return (
      <a
        className={linkClass}
        href={link.href}
        target="_blank"
        rel="noreferrer"
      >
        {link.label}
      </a>
    )
  }
  return (
    <Link className={linkClass} to={link.to ?? '/'}>
      {link.label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#262626] text-white">
      <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <img
              src="/thomson-logo-light.png"
              alt="Thomson Lab"
              className="h-8 w-auto"
            />
            <p className="mt-5 text-[1.05rem] text-[#b4b4b4]">
              The laboratory of living algorithms
            </p>
            <div className="mt-6 flex items-center gap-5 text-white/70">
              <a
                aria-label="Thomson Lab website"
                href="https://thomsonlab.caltech.edu"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </a>
              <Link
                aria-label="Contact us"
                to="/contact"
                className="transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-base font-bold text-white">{col.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
              {col.title === 'Institutional' && (
                <a
                  href="https://www.caltech.edu"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-block"
                >
                  <img
                    src="/caltech-logo.png"
                    alt="California Institute of Technology"
                    className="h-8 w-auto opacity-90 transition-opacity hover:opacity-100"
                  />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-sm text-white/45">© 2026 Thomson Lab.</p>
        </div>
      </div>
    </footer>
  )
}
