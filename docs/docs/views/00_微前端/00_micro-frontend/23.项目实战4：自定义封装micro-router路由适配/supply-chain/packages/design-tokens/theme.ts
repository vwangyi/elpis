export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

export const THEME_STORAGE_KEY = 'supply-chain-theme'
export const THEME_CHANGE_EVENT = 'supply-chain:theme-change'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isTheme(storedTheme) ? storedTheme : 'system'
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getResolvedTheme(): ResolvedTheme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function applyTheme(theme: Theme, persist = true): ResolvedTheme {
  const resolvedTheme = resolveTheme(theme)
  if (typeof document === 'undefined') return resolvedTheme

  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  document.documentElement.dataset.theme = theme
  if (persist) window.localStorage.setItem(THEME_STORAGE_KEY, theme)

  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme, resolvedTheme } }))
  return resolvedTheme
}

export function initializeTheme(): ResolvedTheme {
  return applyTheme(getStoredTheme(), false)
}

export function toggleTheme(): ResolvedTheme {
  return applyTheme(getResolvedTheme() === 'dark' ? 'light' : 'dark')
}
