import type { NextFunction, Request, Response } from 'express'
import { ACCESS_DENIED_MESSAGE, authorize, requireAdmin } from '../middleware/rbac'
import {
  authHeader,
  login,
  readJson,
  startTestApp,
  TEST_CREDENTIALS,
  type TestHarness,
} from '../testing/testApp'

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

describe('rbac middleware', () => {
  it('allows a user whose role is permitted', () => {
    const req = { user: { id: 1, email: 'a@b.c', name: 'A', role: 'ADMIN' } } as Request
    const res = buildResponse() as unknown as Response
    const next = jest.fn() as unknown as NextFunction

    authorize('ADMIN')(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('returns 403 "Access denied" in the standard error format for a forbidden role', () => {
    const req = { user: { id: 2, email: 'u@b.c', name: 'U', role: 'USER' } } as Request
    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    requireAdmin()(req, res as unknown as Response, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body).toMatchObject({ message: ACCESS_DENIED_MESSAGE, status: 403 })
    expect(typeof (res.body as { timestamp: string }).timestamp).toBe('string')
  })

  it('returns 401 when the request is not authenticated', () => {
    const req = {} as Request
    const res = buildResponse()
    const next = jest.fn() as unknown as NextFunction

    authorize('ADMIN')(req, res as unknown as Response, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
  })
})

describe('rbac route protection', () => {
  let harness: TestHarness

  beforeEach(async () => {
    harness = await startTestApp()
  })

  afterEach(async () => {
    await harness.close()
  })

  it('returns 403 Forbidden when a non-admin user calls an admin-only endpoint', async () => {
    const token = await login(harness.baseUrl, TEST_CREDENTIALS.user)

    const response = await fetch(`${harness.baseUrl}/api/users`, {
      headers: { Authorization: authHeader(token) },
    })
    const body = await readJson(response)

    expect(response.status).toBe(403)
    expect(body).toMatchObject({ message: ACCESS_DENIED_MESSAGE, status: 403 })
  })

  it('allows admin users to access admin-only endpoints', async () => {
    const token = await login(harness.baseUrl, TEST_CREDENTIALS.admin)

    const response = await fetch(`${harness.baseUrl}/api/users`, {
      headers: { Authorization: authHeader(token) },
    })
    const body = await readJson(response)

    expect(response.status).toBe(200)
    expect(body.users).toHaveLength(2)
    expect(body.users[0]).not.toHaveProperty('passwordHash')
  })

  it('returns 401 for unauthenticated access to admin-only endpoints', async () => {
    const response = await fetch(`${harness.baseUrl}/api/users`)

    expect(response.status).toBe(401)
  })
})
