import { createApiClient } from '@supply-chain/api-client'
import {
  clearSession,
  persistSession,
  type AuthSession as AuthResponse,
  type AuthUser,
} from '@supply-chain/auth-session'

export { clearSession, persistSession }
export type { AuthUser }

const authClient = createApiClient({ baseUrl: '/api/auth' })

function requestAuth(path: string, payload: object): Promise<AuthResponse> {
  return authClient<AuthResponse>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(username: string, password: string): Promise<AuthResponse> {
  return requestAuth('login', { username, password })
}

export function register(input: {
  username: string
  displayName: string
  password: string
  organizationCode: string
}): Promise<AuthResponse> {
  return requestAuth('register', input)
}
