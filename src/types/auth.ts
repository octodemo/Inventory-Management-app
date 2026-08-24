/**
 * Shared authentication and authorisation types.
 */

/** Roles supported by the system (mirrors the Prisma `UserRole` enum). */
export const USER_ROLES = ['ADMIN', 'USER'] as const

/** Role assigned to a User. */
export type UserRole = (typeof USER_ROLES)[number]

/** User profile returned by the IAM framework and the auth API. */
export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  role: UserRole
}

/** Claims carried by the session token issued after a successful login. */
export interface SessionTokenClaims {
  /** Unique token identifier, used to revoke the token on logout. */
  jti: string
  /** Subject — the authenticated user id. */
  sub: number
  email: string
  name: string
  role: UserRole
  /** Issued-at timestamp, in seconds since the epoch. */
  iat: number
  /** Expiry timestamp, in seconds since the epoch. */
  exp: number
}

declare global {
  namespace Express {
    interface Request {
      /** Populated by the authentication middleware for authenticated requests. */
      user?: AuthenticatedUser
      /** Claims of the session token presented on the request. */
      sessionClaims?: SessionTokenClaims
    }
  }
}
