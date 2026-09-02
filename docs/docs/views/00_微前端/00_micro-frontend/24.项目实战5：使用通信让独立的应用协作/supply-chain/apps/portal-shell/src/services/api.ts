import { createApiClient } from '@supply-chain/api-client'
import { clearSession, getAccessToken, redirectToPortalLogin } from '@supply-chain/auth-session'

export const apiClient = createApiClient({
  baseUrl: '/api',
  getAccessToken,
  onUnauthorized: () => {
    clearSession()
    redirectToPortalLogin(window.location.origin, window.location.pathname)
  },
})
