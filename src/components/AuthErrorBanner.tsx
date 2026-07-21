import { useSearchParams } from 'react-router-dom'

const MESSAGES: Record<string, string> = {
  config:
    'Sign-in is not configured on the server yet (missing Google OAuth environment variables).',
  state: 'Sign-in could not be verified (state mismatch). Please try again.',
  denied: 'Sign-in was cancelled or denied.',
  unverified: 'That Google account does not have a verified email address.',
  exchange:
    'Sign-in failed while completing authentication. Check the server OAuth configuration.',
}

/** Shows a dismissible banner when an ?auth_error=… lands after an OAuth bounce. */
export default function AuthErrorBanner() {
  const [params, setParams] = useSearchParams()
  const code = params.get('auth_error')
  if (!code) return null

  const dismiss = () => {
    const next = new URLSearchParams(params)
    next.delete('auth_error')
    setParams(next, { replace: true })
  }

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-4 px-4 py-3 text-sm"
      style={{ background: '#a84400', color: '#fff' }}
    >
      <span>
        <strong>Sign-in problem:</strong> {MESSAGES[code] ?? `Error: ${code}`}
      </span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded px-2 py-0.5 font-semibold"
        style={{ background: 'rgba(255,255,255,0.2)' }}
      >
        Dismiss
      </button>
    </div>
  )
}
