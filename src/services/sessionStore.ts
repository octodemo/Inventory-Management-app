/** Contract for tracking session tokens revoked by logout. */
export interface SessionStore {
  /** Marks a token id as revoked until its expiry. */
  revoke(tokenId: string, expiresAtSeconds: number): Promise<void>
  /** Indicates whether a token id has been revoked. */
  isRevoked(tokenId: string): Promise<boolean>
}

/**
 * In-memory implementation of {@link SessionStore}.
 *
 * Revoked token ids are retained only until the token would have expired,
 * which keeps memory usage bounded.
 */
export class InMemorySessionStore implements SessionStore {
  private readonly revokedTokens = new Map<string, number>()

  /**
   * Revokes a session token so that it is rejected by the auth middleware.
   *
   * @param tokenId - The `jti` claim of the token being revoked.
   * @param expiresAtSeconds - Token expiry, in seconds since the epoch.
   */
  async revoke(tokenId: string, expiresAtSeconds: number): Promise<void> {
    this.purgeExpired()
    this.revokedTokens.set(tokenId, expiresAtSeconds)
  }

  /**
   * Checks whether a session token has been revoked.
   *
   * @param tokenId - The `jti` claim of the token being checked.
   * @returns `true` when the token was revoked and has not yet expired.
   */
  async isRevoked(tokenId: string): Promise<boolean> {
    this.purgeExpired()
    return this.revokedTokens.has(tokenId)
  }

  private purgeExpired(): void {
    const nowSeconds = Math.floor(Date.now() / 1000)
    for (const [tokenId, expiresAt] of this.revokedTokens) {
      if (expiresAt <= nowSeconds) {
        this.revokedTokens.delete(tokenId)
      }
    }
  }
}
