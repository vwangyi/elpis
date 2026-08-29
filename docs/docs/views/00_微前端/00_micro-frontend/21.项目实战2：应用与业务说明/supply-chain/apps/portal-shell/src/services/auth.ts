export interface AuthUser {
  id: string
  username: string
  displayName: string
  organization: { id: string; name: string }
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

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

export function persistSession(session: AuthResponse): void {
  localStorage.setItem('supply-chain-token', session.accessToken)
  localStorage.setItem('supply-chain-user', JSON.stringify(session.user))
}

export function clearSession(): void {
  localStorage.removeItem('supply-chain-token')
  localStorage.removeItem('supply-chain-user')
}
import { createApiClient } from '@supply-chain/api-client'
