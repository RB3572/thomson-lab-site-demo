import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchSession,
  loginUrl,
  logout as apiLogout,
  type SessionInfo,
} from './api'

interface AuthState extends SessionInfo {
  loading: boolean
  refresh: () => Promise<void>
  login: (next?: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionInfo>({ authenticated: false })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setSession(await fetchSession())
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback((next?: string) => {
    window.location.href = loginUrl(
      next ?? window.location.pathname + window.location.search,
    )
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    await refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ ...session, loading, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
