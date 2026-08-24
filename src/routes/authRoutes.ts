import { Request, Response, Router, RequestHandler } from 'express'
import { createRateLimiter } from '../middleware/rateLimit'
import type { AuthService } from '../services/authService'
import { buildApiError } from '../utils/apiError'
import { SESSION_COOKIE_NAME } from '../utils/sessionToken'

/** Collaborators required by the auth router. */
export interface AuthRouterDependencies {
  authService: AuthService
  /** Authentication middleware protecting `/me` and `/logout`. */
  authenticate: RequestHandler
  /** Session token lifetime in seconds, used for the session cookie max age. */
  sessionTtlSeconds: number
}

/**
 * Creates the authentication router exposing the IAM login, logout and
 * current-user endpoints.
 *
 * @param dependencies - Injected auth service, authentication middleware and token lifetime.
 * @returns An Express router mounted at `/api/auth`.
 */
export const createAuthRouter = ({
  authService,
  authenticate,
  sessionTtlSeconds,
}: AuthRouterDependencies): Router => {
  const router = Router()
  const loginRateLimiter = createRateLimiter({ windowMs: 60_000, max: 20 })

  router.post('/login', loginRateLimiter, async (req: Request, res: Response): Promise<void> => {
    const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown }

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      res.status(400).json(buildApiError('Email and password are required', 400))
      return
    }

    const result = await authService.login(email, password)
    if (!result) {
      res.status(401).json(buildApiError('Invalid credentials', 401))
      return
    }

    res.cookie(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtlSeconds * 1000,
    })

    res.status(200).json({ user: result.user, token: result.token })
  })

  router.post('/logout', authenticate, async (req: Request, res: Response): Promise<void> => {
    if (req.sessionClaims) {
      await authService.logout(req.sessionClaims)
    }

    res.clearCookie(SESSION_COOKIE_NAME)
    res.status(200).json({ message: 'Logged out successfully' })
  })

  router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ user: req.user })
  })

  return router
}
