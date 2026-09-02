export interface JwtPayload {
  sub: string
  username: string
  organizationId: string
}

export interface AuthenticatedUser {
  userId: string
  username: string
  organizationId: string
}
