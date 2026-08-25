import { createAuthenticate } from '../middleware/auth'
import { InMemorySessionStore } from '../services/sessionStore'
import { JwtTokenService } from '../services/tokenService'
import type { NextFunction, Request, Response } from 'express'
import { authHeader } from '../testing/testApp'

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

const buildRequest = (headers: Record<string, string> = {}): Request =>
  ({ headers }) as unknown as Request

describe('authentication middleware', () => {
  const user = { id: 1, email: 'admin@stationery.local', name: 'Admin', role: 'ADMIN' as const }

  it('attaches the authenticated user for a valid token', async () => {
    const tokenService = new JwtTokenService({ secret: 'unit-test-secret', ttlSeconds: 60 })
    const sessionStore = new InMemorySessionStore()
    const authenticate = createAuthenticate({ tokenService, sessionStore })

    const req = buildRequest({ authorization: authHeader(tokenService.issue(user)) })
    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    await authenticate(req, res as unknown as Response, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(req.user).toEqual(user)
  })

  it('returns 401 when authentication is missing', async () => {
    const tokenService = new JwtTokenService({ secret: 'unit-test-secret', ttlSeconds: 60 })
    const authenticate = createAuthenticate({ tokenService, sessionStore: new InMemorySessionStore() })

    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    await authenticate(buildRequest(), res as unknown as Response, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
    expect(res.body).toMatchObject({ message: 'Authentication required', status: 401 })
  })

  it('returns 401 for a token signed with a different secret', async () => {
    const foreignToken = new JwtTokenService({ secret: 'other-secret', ttlSeconds: 60 }).issue(user)
    const authenticate = createAuthenticate({
      tokenService: new JwtTokenService({ secret: 'unit-test-secret', ttlSeconds: 60 }),
      sessionStore: new InMemorySessionStore(),
    })

    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    await authenticate(
      buildRequest({ authorization: authHeader(foreignToken) }),
      res as unknown as Response,
      next,
    )

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
    expect(res.body).toMatchObject({ message: 'Invalid or expired session', status: 401 })
  })

  it('returns 401 for an expired session', async () => {
    const tokenService = new JwtTokenService({ secret: 'unit-test-secret', ttlSeconds: -1 })
    const authenticate = createAuthenticate({ tokenService, sessionStore: new InMemorySessionStore() })

    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    await authenticate(
      buildRequest({ authorization: authHeader(tokenService.issue(user)) }),
      res as unknown as Response,
      next,
    )

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
    expect(res.body).toMatchObject({ message: 'Invalid or expired session', status: 401 })
  })

  it('returns 401 for a token revoked by logout', async () => {
    const tokenService = new JwtTokenService({ secret: 'unit-test-secret', ttlSeconds: 60 })
    const sessionStore = new InMemorySessionStore()
    const authenticate = createAuthenticate({ tokenService, sessionStore })

    const token = tokenService.issue(user)
    const claims = tokenService.verify(token)!
    await sessionStore.revoke(claims.jti, claims.exp)

    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    await authenticate(
      buildRequest({ authorization: authHeader(token) }),
      res as unknown as Response,
      next,
    )

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
  })
})
