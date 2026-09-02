export interface AuthUser {
  id: string
  username: string
  displayName: string
  organization: { id: string; name: string }
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

// Token 是后端验证身份的凭证，只在请求 API 时使用。
const TOKEN_STORAGE_KEY = 'supply-chain-token'
// User 是页面展示姓名和组织信息的缓存，不能作为后端鉴权或权限判断依据。
const USER_STORAGE_KEY = 'supply-chain-user'

export function getAccessToken(): string | null {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function hasSession(): boolean {
  // 这里只做前端入口的快速判断，Token 是否有效仍由 API Server 决定。
  return Boolean(getAccessToken())
}

export function getSessionUser(): AuthUser | null {
  const value = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    return null
  }
}

export function persistSession(session: AuthSession): void {
  // 分开保存凭证和展示数据，让 API Client 与页面各自只读取需要的内容。
  window.localStorage.setItem(TOKEN_STORAGE_KEY, session.accessToken)
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user))
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(USER_STORAGE_KEY)
}

export function getSafeRedirect(value: unknown, fallback = '/'): string {
  // 只允许站内绝对路径，拒绝 //evil.example.com 形式的开放重定向。
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : fallback
}

export function redirectToPortalLogin(portalOrigin: string, redirect: string): void {
  const loginUrl = new URL('/login', portalOrigin)
  loginUrl.searchParams.set('redirect', getSafeRedirect(redirect))
  // replace 避免后退时再次回到必然触发认证跳转的子应用入口。
  window.location.replace(loginUrl)
}
