import type { NextFunction, Request, Response } from 'express'
import { createRateLimiter } from '../middleware/rateLimit'

const buildResponse = () => {
  const response = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      response.statusCode = code
      return response
    },
    json(payload: unknown) {
      response.body = payload
      return response
    },
  }
  return response
}

const buildRequest = (ip = '10.0.0.1'): Request => ({ ip, socket: {} }) as unknown as Request

describe('rate limiter middleware', () => {
  it('allows requests up to the configured limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 2 })
    const next = jest.fn() as unknown as NextFunction

    limiter(buildRequest(), buildResponse() as unknown as Response, next)
    limiter(buildRequest(), buildResponse() as unknown as Response, next)

    expect(next).toHaveBeenCalledTimes(2)
  })

  it('rejects requests beyond the limit with 429 in the standard error format', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 })
    const next = jest.fn() as unknown as NextFunction

    limiter(buildRequest(), buildResponse() as unknown as Response, next)

    const res = buildResponse()
    limiter(buildRequest(), res as unknown as Response, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.statusCode).toBe(429)
    expect(res.body).toMatchObject({ message: 'Too many requests', status: 429 })
  })

  it('tracks clients independently', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 })
    const next = jest.fn() as unknown as NextFunction

    limiter(buildRequest('10.0.0.1'), buildResponse() as unknown as Response, next)
    limiter(buildRequest('10.0.0.2'), buildResponse() as unknown as Response, next)

    expect(next).toHaveBeenCalledTimes(2)
  })
})
