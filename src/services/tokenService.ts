import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { AuthenticatedUser, SessionTokenClaims, UserRole } from '../types/auth'
import { USER_ROLES } from '../types/auth'

/** Contract for issuing and validating session tokens. */
export interface TokenService {
  /** Issues a signed session token for an authenticated user. */
  issue(user: AuthenticatedUser): string
  /** Verifies a session token and returns its claims, or `null` when invalid. */
  verify(token: string): SessionTokenClaims | null
}

/** Options accepted by {@link JwtTokenService}. */
export interface JwtTokenServiceOptions {
  /** Secret used to sign tokens. Never hardcode it — inject it from the environment. */
  secret: string
  /** Token lifetime in seconds. */
  ttlSeconds: number
}

const base64UrlEncode = (value: Buffer | string): string =>
  Buffer.from(value).toString('base64url')

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value)

/**
 * JWT (HS256) implementation of {@link TokenService}.
 *
 * Tokens are self contained so that the API layer stays stateless; logout is
 * handled by revoking the token id through the session store.
 */
export class JwtTokenService implements TokenService {
  private readonly secret: string
  private readonly ttlSeconds: number

  /**
   * Creates a token service.
   *
   * @param options - Signing secret and token lifetime.
   */
  constructor(options: JwtTokenServiceOptions) {
    if (!options.secret) {
      throw new Error('A signing secret is required to issue session tokens')
    }
    this.secret = options.secret
    this.ttlSeconds = options.ttlSeconds
  }

  /**
   * Issues a signed session token for an authenticated user.
   *
   * @param user - Authenticated user profile returned by the IAM framework.
   * @returns The signed JWT.
   */
  issue(user: AuthenticatedUser): string {
    const issuedAt = Math.floor(Date.now() / 1000)
    const claims: SessionTokenClaims = {
      jti: randomUUID(),
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: issuedAt,
      exp: issuedAt + this.ttlSeconds,
    }

    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = base64UrlEncode(JSON.stringify(claims))
    const signature = this.sign(`${header}.${payload}`)

    return `${header}.${payload}.${signature}`
  }

  /**
   * Verifies a session token signature and expiry.
   *
   * @param token - Raw JWT presented by the caller.
   * @returns The token claims when valid, otherwise `null`.
   */
  verify(token: string): SessionTokenClaims | null {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [header, payload, signature] = parts
    const expectedSignature = this.sign(`${header}.${payload}`)
    const provided = Buffer.from(signature)
    const expected = Buffer.from(expectedSignature)

    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      return null
    }

    let claims: unknown
    try {
      claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    } catch {
      return null
    }

    if (!this.isSessionTokenClaims(claims)) {
      return null
    }

    if (claims.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return claims
  }

  private sign(input: string): string {
    return createHmac('sha256', this.secret).update(input).digest('base64url')
  }

  private isSessionTokenClaims(value: unknown): value is SessionTokenClaims {
    if (typeof value !== 'object' || value === null) {
      return false
    }
    const candidate = value as Record<string, unknown>
    return (
      typeof candidate.jti === 'string' &&
      typeof candidate.sub === 'number' &&
      typeof candidate.email === 'string' &&
      typeof candidate.name === 'string' &&
      isUserRole(candidate.role) &&
      typeof candidate.iat === 'number' &&
      typeof candidate.exp === 'number'
    )
  }
}
