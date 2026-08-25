import { randomBytes } from 'node:crypto'

/** Runtime configuration for the authentication layer. */
export interface AuthConfig {
  /** Secret used to sign session tokens. */
  jwtSecret: string
  /** Session token lifetime in seconds. */
  sessionTtlSeconds: number
}

const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 8

/**
 * Loads the authentication configuration from environment variables.
 *
 * `AUTH_JWT_SECRET` is mandatory in production; outside production a random
 * per-process secret is generated so the app can be started without setup.
 * Secrets are never hardcoded.
 *
 * @param env - Environment to read from. Defaults to `process.env`.
 * @returns The resolved authentication configuration.
 */
export const loadAuthConfig = (env: NodeJS.ProcessEnv = process.env): AuthConfig => {
  const secret = env.AUTH_JWT_SECRET

  if (!secret && env.NODE_ENV === 'production') {
    throw new Error('AUTH_JWT_SECRET must be set')
  }

  const ttl = Number(env.AUTH_SESSION_TTL_SECONDS)

  return {
    jwtSecret: secret || randomBytes(32).toString('hex'),
    sessionTtlSeconds: Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_SESSION_TTL_SECONDS,
  }
}
