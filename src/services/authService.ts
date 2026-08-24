import type { AuthenticatedUser, SessionTokenClaims } from '../types/auth'
import type { IamClient } from './iamClient'
import type { SessionStore } from './sessionStore'
import type { TokenService } from './tokenService'

/** Result of a successful login. */
export interface LoginResult {
  user: AuthenticatedUser
  token: string
}

/** Collaborators required by {@link AuthService}. */
export interface AuthServiceDependencies {
  iamClient: IamClient
  tokenService: TokenService
  sessionStore: SessionStore
}

/**
 * Application service orchestrating the login / logout lifecycle across the
 * IAM framework, the session token service and the session store.
 */
export class AuthService {
  private readonly iamClient: IamClient
  private readonly tokenService: TokenService
  private readonly sessionStore: SessionStore

  /**
   * Creates the auth service.
   *
   * @param dependencies - Injected IAM client, token service and session store.
   */
  constructor({ iamClient, tokenService, sessionStore }: AuthServiceDependencies) {
    this.iamClient = iamClient
    this.tokenService = tokenService
    this.sessionStore = sessionStore
  }

  /**
   * Authenticates a user via the IAM framework and issues a session token.
   *
   * @param email - Corporate email address of the principal.
   * @param password - Credential supplied by the principal.
   * @returns The authenticated user and session token, or `null` when the
   * credentials are rejected by the IAM framework.
   */
  async login(email: string, password: string): Promise<LoginResult | null> {
    const user = await this.iamClient.authenticate(email, password)
    if (!user) {
      return null
    }

    return { user, token: this.tokenService.issue(user) }
  }

  /**
   * Terminates a session by revoking its token and notifying the IAM framework.
   *
   * @param claims - Claims of the session token being terminated.
   */
  async logout(claims: SessionTokenClaims): Promise<void> {
    await this.sessionStore.revoke(claims.jti, claims.exp)
    await this.iamClient.terminateSession({
      id: claims.sub,
      email: claims.email,
      name: claims.name,
      role: claims.role,
    })
  }
}
