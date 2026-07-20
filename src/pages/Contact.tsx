import InstitutionalShell, { InstSection } from '@/components/InstitutionalShell'

function MailIcon() {
  return (
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
      <rect x="2" y="4" width="20" height="16" rx="1" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

function PinIcon() {
  return (
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function Contact() {
  return (
    <InstitutionalShell
      title="Contact Us"
      intro="Get in touch with the Thomson Lab at the California Institute of Technology."
    >
      <InstSection compact>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Address */}
          <div className="inst-card p-7">
            <div
              className="flex h-9 w-9 items-center justify-center text-white"
              style={{ background: 'var(--inst-accent)' }}
            >
              <PinIcon />
            </div>
            <p className="inst-label mt-5">Address</p>
            <address className="mt-3 not-italic leading-relaxed">
              <span className="font-semibold">Thomson Lab</span>
              <br />
              <span className="inst-muted">
                Beckman Behavioral Biology
                <br />
                California Institute of Technology
                <br />
                1200 East California Boulevard
                <br />
                Pasadena, California 91125
              </span>
            </address>
          </div>

          {/* Email */}
          <div className="inst-card flex flex-col p-7">
            <div
              className="flex h-9 w-9 items-center justify-center text-white"
              style={{ background: 'var(--inst-accent)' }}
            >
              <MailIcon />
            </div>
            <p className="inst-label mt-5">Email</p>
            <p className="inst-muted mt-3 flex-1 leading-relaxed">
              For inquiries, including prospective students and collaborators,
              reach out to Matt Thomson:
            </p>
            <a
              href="mailto:mthomson@caltech.edu"
              className="inst-btn inst-btn-primary mt-5 self-start"
            >
              mthomson@caltech.edu
            </a>
          </div>
        </div>
      </InstSection>
    </InstitutionalShell>
  )
}
