import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

/** Read the theme currently applied to <html> (set pre-paint in index.html). */
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

/**
 * Theme state backed by the `light` class on <html> and localStorage. The class
 * is applied before paint by an inline script in index.html; this hook keeps
 * React in sync and lets any component toggle it.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  // Keep multiple mounted consumers (and other tabs) in sync.
  useEffect(() => {
    const sync = () => setTheme(currentTheme())
    window.addEventListener('themechange', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('themechange', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = () => {
    const next: Theme = currentTheme() === 'light' ? 'dark' : 'light'
    document.documentElement.classList.toggle('light', next === 'light')
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage may be unavailable (private mode) — theme still applies for the session */
    }
    setTheme(next)
    window.dispatchEvent(new Event('themechange'))
  }

  return { theme, toggle }
}
