import { Link, useLocation } from 'react-router-dom'

type FooterLink = { label: string; to?: string; href?: string }

/** Routes that render the white, institutional theme — the footer goes light. */
const INSTITUTIONAL_PATHS = new Set([
  '/research',
  '/calendar',
  '/resources',
  '/contact',
  '/secure-resources',
  '/admin',
])

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
      { label: 'Calendar', to: '/calendar' },
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

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.href) {
    return (
      <a
        className="footer-link"
        href={link.href}
        target="_blank"
        rel="noreferrer"
      >
        {link.label}
      </a>
    )
  }
  return (
    <Link className="footer-link" to={link.to ?? '/'}>
      {link.label}
    </Link>
  )
}

export default function Footer() {
  const { pathname } = useLocation()
  const light = INSTITUTIONAL_PATHS.has(pathname)

  return (
    <footer
      className="site-footer relative z-10"
      data-light={light ? 'true' : undefined}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand — the wordmark PNG is white, so on the light footer we show a
              dark text wordmark instead (a brightness filter would black out the
              logo's DNA dot into a blob). */}
          <div>
            {light ? (
              <span className="footer-heading text-2xl font-extrabold tracking-tight">
                Thomson Lab
              </span>
            ) : (
              <img
                src="/thomson-logo-light.png"
                alt="Thomson Lab"
                className="h-8 w-auto"
              />
            )}
            <p className="footer-tagline mt-5 text-[1.05rem]">
              The laboratory of living algorithms
            </p>
            <div className="mt-6 flex items-center gap-5">
              <a
                aria-label="Thomson Lab website"
                href="https://thomsonlab.caltech.edu"
                target="_blank"
                rel="noreferrer"
                className="footer-social"
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
                className="footer-social"
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
              <h3 className="footer-heading text-base font-bold">{col.title}</h3>
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

        <div className="footer-divider mt-14 border-t pt-8">
          <p className="footer-copyright text-sm">© 2026 Thomson Lab.</p>
        </div>
      </div>
    </footer>
  )
}
