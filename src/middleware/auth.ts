import { Request, Response, NextFunction, RequestHandler } from 'express'
import type { SessionStore } from '../services/sessionStore'
import type { TokenService } from '../services/tokenService'
import { buildApiError } from '../utils/apiError'
import { extractSessionToken } from '../utils/sessionToken'

export { authorize, requireAdmin } from './rbac'

/** Collaborators required by the authentication middleware. */
export interface AuthenticateDependencies {
  tokenService: TokenService
  sessionStore: SessionStore
}

/**
 * Creates the authentication middleware.
 *
 * The middleware validates the session token issued by the IAM login flow and
 * attaches the resulting user profile to the request. Requests without a valid,
 * unexpired and unrevoked token are rejected with 401 Unauthorized using the
 * standard error format.
 *
 * @param dependencies - Injected token service and session store.
 * @returns An Express middleware enforcing authentication.
 */
export const createAuthenticate = ({
  tokenService,
  sessionStore,
}: AuthenticateDependencies): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = extractSessionToken(req)
    if (!token) {
      res.status(401).json(buildApiError('Authentication required', 401))
      return
    }

    const claims = tokenService.verify(token)
    if (!claims) {
      res.status(401).json(buildApiError('Invalid or expired session', 401))
      return
    }

    if (await sessionStore.isRevoked(claims.jti)) {
      res.status(401).json(buildApiError('Invalid or expired session', 401))
      return
    }

    req.sessionClaims = claims
    req.user = {
      id: claims.sub,
      email: claims.email,
      name: claims.name,
      role: claims.role,
    }

    next()
  }
}
