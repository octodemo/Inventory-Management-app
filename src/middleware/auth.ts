import { Request, Response, NextFunction } from 'express'

// Authentication middleware stub
// Will be implemented by implement-agent
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement authentication logic
  next()
}

export interface AuthenticatedRequest extends Request {
  user?: { id?: string; email?: string; role?: string }
}

/**
 * Role-based access control middleware.
 * Allows the request through when the authenticated user holds one of the
 * supplied roles, otherwise responds with 403 Forbidden using the standard
 * API error format.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user

    if (!user || !user.role || !roles.includes(user.role)) {
      res.status(403).json({
        message: 'Forbidden',
        status: 403,
        timestamp: new Date().toISOString(),
      })
      return
    }

    next()
  }
}
