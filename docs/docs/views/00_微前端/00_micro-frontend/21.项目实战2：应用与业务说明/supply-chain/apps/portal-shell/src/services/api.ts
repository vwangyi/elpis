import { createApiClient } from '@supply-chain/api-client'

export const apiClient = createApiClient({
  baseUrl: '/api',
  getAccessToken: () => localStorage.getItem('supply-chain-token'),
})
