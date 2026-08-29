import {
  clearSession,
  getAccessToken,
  hasSession,
  redirectToPortalLogin,
} from '@supply-chain/auth-session'

const PORTAL_ORIGIN =
  window.location.port === '6174' ? 'http://localhost:6173' : 'http://localhost:5173'

function getPortalPath() {
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
  // qiankun 环境中地址已经包含应用前缀，不能再次拼接 /fulfillment。
  if (window.location.pathname.startsWith('/fulfillment')) return currentPath

  const childPath = window.location.pathname === '/' ? '' : window.location.pathname
  return `/fulfillment${childPath}${window.location.search}${window.location.hash}`
}

export function ensureAuthenticated() {
  // 必须在 createApp 之前检查，避免未授权业务页面短暂闪现。
  // 独立端口只用于开发调试，直接访问时始终回到主应用统一入口。
  if (!window.__POWERED_BY_QIANKUN__) {
    redirectToPortalLogin(PORTAL_ORIGIN, getPortalPath())
    return false
  }

  if (hasSession()) return true
  redirectToPortalLogin(PORTAL_ORIGIN, getPortalPath())
  return false
}

export function getFulfillmentAccessToken() {
  return getAccessToken()
}

export function handleUnauthorized() {
  // Token 过期或伪造时清理本地假会话，再回到统一登录入口。
  clearSession()
  redirectToPortalLogin(PORTAL_ORIGIN, getPortalPath())
}
