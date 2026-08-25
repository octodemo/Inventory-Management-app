import type { AuthenticatedUser } from '../types/auth'
import { verifyPassword } from '../utils/password'
import type { UserRepository } from './userRepository'

/**
 * Integration point with the organisation's IAM framework.
 *
 * The API layer only depends on this contract, so the local credential based
 * implementation can be swapped for an OAuth2 / SAML client without touching
 * routes or middleware.
 */
export interface IamClient {
  /**
   * Authenticates a principal against the IAM framework.
   *
   * @param email - Corporate email address of the principal.
   * @param password - Credential supplied by the principal.
   * @returns The authenticated user profile, or `null` when authentication fails.
   */
  authenticate(email: string, password: string): Promise<AuthenticatedUser | null>

  /**
   * Notifies the IAM framework that a session has been terminated.
   *
   * @param user - The user whose session ended.
   */
  terminateSession(user: AuthenticatedUser): Promise<void>
}

/**
 * IAM client backed by the User records mirrored into the application database.
 *
 * Credentials are validated against the scrypt hash synchronised from the IAM
 * framework, which keeps local development and tests self contained.
 */
export class DatabaseIamClient implements IamClient {
  private readonly userRepository: UserRepository

  /**
   * Creates an IAM client.
   *
   * @param userRepository - Repository used to look up mirrored User records.
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  /**
   * Authenticates a principal using the mirrored IAM credentials.
   *
   * @param email - Corporate email address of the principal.
   * @param password - Credential supplied by the principal.
   * @returns The authenticated user profile, or `null` when authentication fails.
   */
  async authenticate(email: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.userRepository.findByEmail(email.trim().toLowerCase())
    if (!user) {
      return null
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash)
    if (!passwordMatches) {
      return null
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role }
  }

  /**
   * Notifies the IAM framework that a session has been terminated.
   *
   * The local implementation has no remote session to end, so this is a no-op.
   *
   * @param _user - The user whose session ended.
   */
  async terminateSession(_user: AuthenticatedUser): Promise<void> {
    // No remote IAM session to terminate for the local credential mirror.
  }
}
