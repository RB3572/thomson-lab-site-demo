import { useEffect, useState } from 'react'
import InstitutionalShell, { InstSection } from '@/components/InstitutionalShell'
import { useAuth } from '@/lib/auth'
import { fetchJson } from '@/lib/api'

const PATH = '/secure-resources'

interface SecureResource {
  title: string
  description: string
  href: string
  kind: string
}

function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="inst-btn inst-btn-primary">
      {label}
    </button>
  )
}

function Loading() {
  return <p className="inst-muted">Checking your access…</p>
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="inst-panel max-w-xl p-8">
      <p className="inst-label">Restricted</p>
      <h2 className="inst-serif mt-3 text-2xl">Lab members only</h2>
      <p className="inst-muted mt-3 leading-relaxed">
        These resources are available to verified Thomson Lab members. Sign in
        with your Caltech Google account to continue.
      </p>
      <div className="mt-6">
        <GoogleButton onClick={onSignIn} label="Sign in with your Caltech email" />
      </div>
    </div>
  )
}

function NotAuthorized({
  email,
  onSwitch,
  onSignOut,
}: {
  email?: string | null
  onSwitch: () => void
  onSignOut: () => void
}) {
  return (
    <div className="inst-panel max-w-xl p-8">
      <p className="inst-label">Access denied</p>
      <h2 className="inst-serif mt-3 text-2xl">Not a recognized lab member</h2>
      <p className="inst-muted mt-3 leading-relaxed">
        You’re signed in as <span className="font-semibold">{email}</span>, but
        this address isn’t on the lab roster. If you believe this is a mistake,
        ask the lab admin to add your Caltech email.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onSwitch} className="inst-btn inst-btn-secondary">
          Use a different account
        </button>
        <button type="button" onClick={onSignOut} className="inst-btn inst-btn-secondary">
          Sign out
        </button>
      </div>
    </div>
  )
}

function Authorized({
  email,
  resources,
  err,
  onSignOut,
}: {
  email?: string | null
  resources: SecureResource[] | null
  err: string | null
  onSignOut: () => void
}) {
  return (
    <div>
      <div
        className="mb-8 flex flex-wrap items-center justify-between gap-3 pb-4"
        style={{ borderBottom: '1px solid var(--inst-border)' }}
      >
        <p className="inst-muted text-sm">
          Signed in as <span className="font-semibold">{email}</span>
        </p>
        <button type="button" onClick={onSignOut} className="inst-link text-sm">
          Sign out
        </button>
      </div>

      {err && <p className="inst-muted">{err}</p>}
      {!err && !resources && <p className="inst-muted">Loading resources…</p>}

      {resources && (
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((r) => (
            <article key={r.href} className="inst-card p-7">
              <p className="inst-label">Shared drive</p>
              <h3 className="inst-serif mt-3 text-xl">{r.title}</h3>
              <p className="inst-muted mt-3 text-[0.95rem] leading-relaxed">
                {r.description}
              </p>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="inst-btn inst-btn-primary mt-6"
              >
                Open in Google Drive
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SecureResources() {
  const auth = useAuth()
  const [resources, setResources] = useState<SecureResource[] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (auth.loading || !auth.isAllowlisted) return
    fetchJson<{ resources: SecureResource[] }>('/api/secure-resources').then(
      (d) => {
        if (d) setResources(d.resources)
        else setErr('Could not load secure resources. Please try again.')
      },
    )
  }, [auth.loading, auth.isAllowlisted])

  return (
    <InstitutionalShell
      eyebrow="Thomson Lab — Members"
      title="Secure Resources"
      intro="Internal materials shared with verified members of the Thomson Lab."
    >
      <InstSection compact>
        {auth.loading ? (
          <Loading />
        ) : !auth.authenticated ? (
          <SignIn onSignIn={() => auth.login(PATH)} />
        ) : !auth.isAllowlisted ? (
          <NotAuthorized
            email={auth.email}
            onSwitch={() => auth.login(PATH)}
            onSignOut={auth.logout}
          />
        ) : (
          <Authorized
            email={auth.email}
            resources={resources}
            err={err}
            onSignOut={auth.logout}
          />
        )}
      </InstSection>
    </InstitutionalShell>
  )
}
