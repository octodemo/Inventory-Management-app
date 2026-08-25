import { Request, Response, NextFunction, RequestHandler } from 'express'
import type { UserRole } from '../types/auth'
import { buildApiError } from '../utils/apiError'

/** Message returned when an authenticated user lacks the required role. */
export const ACCESS_DENIED_MESSAGE = 'Access denied'

/**
 * Creates a role based access control middleware.
 *
 * Must run after the authentication middleware: unauthenticated requests are
 * rejected with 401 Unauthorized, and authenticated requests whose role is not
 * allowed are rejected with 403 Forbidden and the message "Access denied", both
 * in the standard error format.
 *
 * @param roles - Roles allowed to access the route.
 * @returns An Express middleware enforcing the role check.
 */
export const authorize = (...roles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user
    if (!user) {
      res.status(401).json(buildApiError('Authentication required', 401))
      return
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      res.status(403).json(buildApiError(ACCESS_DENIED_MESSAGE, 403))
      return
    }

    next()
  }
}

/**
 * Convenience middleware restricting a route to ADMIN users.
 *
 * @returns An Express middleware allowing only the ADMIN role.
 */
export const requireAdmin = (): RequestHandler => authorize('ADMIN')
