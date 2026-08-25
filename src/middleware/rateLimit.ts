import { Request, Response, NextFunction, RequestHandler } from 'express'
import { buildApiError } from '../utils/apiError'

/** Options accepted by {@link createRateLimiter}. */
export interface RateLimiterOptions {
  /** Length of the sliding window, in milliseconds. */
  windowMs: number
  /** Maximum number of requests allowed per client within the window. */
  max: number
}

/**
 * Creates a simple in-memory rate limiter.
 *
 * Protects sensitive endpoints such as login against brute force attempts by
 * rejecting excessive requests from the same client with 429 Too Many Requests
 * in the standard error format.
 *
 * @param options - Window length and request allowance.
 * @returns An Express middleware enforcing the limit.
 */
export const createRateLimiter = ({ windowMs, max }: RateLimiterOptions): RequestHandler => {
  const hits = new Map<string, { count: number; expiresAt: number }>()

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now()

    for (const [key, entry] of hits) {
      if (entry.expiresAt <= now) {
        hits.delete(key)
      }
    }

    const clientKey = req.ip ?? req.socket.remoteAddress ?? 'unknown'
    const entry = hits.get(clientKey)

    if (!entry) {
      hits.set(clientKey, { count: 1, expiresAt: now + windowMs })
      next()
      return
    }

    entry.count += 1

    if (entry.count > max) {
      res.status(429).json(buildApiError('Too many requests', 429))
      return
    }

    next()
  }
}
