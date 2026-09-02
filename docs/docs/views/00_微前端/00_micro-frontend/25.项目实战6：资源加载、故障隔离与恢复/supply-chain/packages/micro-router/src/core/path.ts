export function normalizeBase(base: string): string {
  const withLeadingSlash = base.startsWith('/') ? base : `/${base}`
  if (withLeadingSlash === '/') return '/'
  return withLeadingSlash.replace(/\/+$/, '')
}

export function getBrowserLocation(targetWindow: Window = window): string {
  const { pathname, search, hash } = targetWindow.location
  return `${pathname}${search}${hash}`
}

export function isLocationInBase(browserLocation: string, base: string): boolean {
  const normalizedBase = normalizeBase(base)
  const pathname = browserLocation.split(/[?#]/, 1)[0] || '/'

  return (
    normalizedBase === '/' ||
    pathname === normalizedBase ||
    pathname.startsWith(`${normalizedBase}/`)
  )
}

export function toInternalLocation(browserLocation: string, base: string): string {
  const normalizedBase = normalizeBase(base)
  if (normalizedBase === '/') return browserLocation || '/'

  if (browserLocation === normalizedBase) return '/'
  if (browserLocation.startsWith(`${normalizedBase}/`)) {
    return browserLocation.slice(normalizedBase.length) || '/'
  }

  return '/'
}

export function toBrowserLocation(internalLocation: string, base: string): string {
  const normalizedBase = normalizeBase(base)
  const normalizedLocation = internalLocation.startsWith('/')
    ? internalLocation
    : `/${internalLocation}`

  if (normalizedBase === '/') return normalizedLocation
  return normalizedLocation === '/'
    ? `${normalizedBase}/`
    : `${normalizedBase}${normalizedLocation}`
}
