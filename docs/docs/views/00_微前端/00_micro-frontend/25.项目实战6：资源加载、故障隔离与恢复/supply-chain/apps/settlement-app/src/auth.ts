import {
  clearSession,
  getAccessToken,
  hasSession,
  redirectToPortalLogin,
} from '@supply-chain/auth-session'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const PORTAL_ORIGIN =
  import.meta.env.VITE_PORTAL_ORIGIN ??
  (import.meta.env.PROD ? 'http://localhost:6173' : 'http://localhost:5173')

function getPortalPath() {
  // 结算中心使用 Hash Router，hash 才是子应用内部的业务路由。
  return `/settlement${window.location.hash}`
}

export function ensureAuthenticated() {
  // 必须在 createRoot 之前检查，避免未授权业务页面短暂闪现。
  // 独立端口只用于开发调试，直接访问时始终回到主应用统一入口。
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    redirectToPortalLogin(PORTAL_ORIGIN, getPortalPath())
    return false
  }

  if (hasSession()) return true
  redirectToPortalLogin(PORTAL_ORIGIN, getPortalPath())
  return false
}

export function getSettlementAccessToken() {
  return getAccessToken()
}

export function handleUnauthorized() {
  // Token 过期或伪造时清理本地假会话，再回到统一登录入口。
  clearSession()
  redirectToPortalLogin(PORTAL_ORIGIN, getPortalPath())
}
