/**
 * Unit tests for src/routes/supervisors.ts + src/services/supervisorService.ts
 *
 * Covers:
 * - issues/91-UNIT-TEST-supervisor-api.md (dependencies: 31-BACKEND-supervisor-api)
 * - issues/93-UNIT-TEST-supervisor-delete-validation-api.md (dependencies: 33-BACKEND-supervisor-delete-validation-api)
 */
import { createMockRequest, createMockResponse, getRouteHandlers, invokeRoute } from '../testSupport/routeHarness.js'

// The route's `authenticate`/`authorize` middleware is now the real
// IAM-integrated implementation (src/middleware/auth.ts), which requires a
// valid signed session token. These tests exercise route/service logic in
// isolation, so the middleware is mocked to simulate an authenticated ADMIN
// caller by default; individual tests can override `req.user` via
// `createMockRequest({ user: {...} })` if a different role is needed.
jest.mock('../middleware/auth.js', () => ({
  authenticate: (req: any, _res: any, next: () => void) => {
    req.user = req.user ?? { id: 1, email: 'test-admin@test.local', name: 'Test Admin', role: 'ADMIN' }
    next()
  },
  authorize:
    (..._roles: string[]) =>
    (_req: any, _res: any, next: () => void) => next(),
  requireAdmin: () => (_req: any, _res: any, next: () => void) => next(),
}))

jest.mock('../lib/prisma.js', () => ({
  prisma: {
    supervisor: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import supervisorsRouter from '../routes/supervisors.js'

const mockPrisma = prisma as unknown as {
  supervisor: {
    findMany: jest.Mock
    count: jest.Mock
    findUnique: jest.Mock
    create: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/supervisors (issue 91, AC1)', () => {
  it('creates a supervisor with a unique email and returns 201 Created', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue(null)
    mockPrisma.supervisor.create.mockResolvedValue({
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: null,
    })

    const handlers = getRouteHandlers(supervisorsRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Jane Doe', email: 'jane@example.com' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.supervisor.create).toHaveBeenCalledWith({
      data: { name: 'Jane Doe', email: 'jane@example.com', phone: null },
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({ id: 1, email: 'jane@example.com' })
  })

  it('returns 400 Bad Request when the email is already in use', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue({ id: 2, email: 'jane@example.com' })

    const handlers = getRouteHandlers(supervisorsRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Duplicate', email: 'jane@example.com' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(mockPrisma.supervisor.create).not.toHaveBeenCalled()
  })
})

describe('GET /api/supervisors/:id (issue 91, AC2)', () => {
  it('returns supervisor details including the list of assigned premises', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue({
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: null,
      premises: [
        { id: 100, name: 'Premises A', supervisorId: 1 },
        { id: 101, name: 'Premises B', supervisorId: 1 },
      ],
    })

    const handlers = getRouteHandlers(supervisorsRouter, 'get', '/:id')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.supervisor.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { premises: true },
    })
    expect(res.statusCode).toBe(200)
    const body = res.body as { premises: unknown[] }
    expect(body.premises).toHaveLength(2)
  })

  it('returns 404 Not Found when the supervisor does not exist', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(supervisorsRouter, 'get', '/:id')
    const req = createMockRequest({ params: { id: '999' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/supervisors/:id (issue 93)', () => {
  it('deletes the supervisor and returns 204 No Content when no premises are assigned (AC1)', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue({ id: 1, _count: { premises: 0 } })
    mockPrisma.supervisor.delete.mockResolvedValue({ id: 1 })

    const handlers = getRouteHandlers(supervisorsRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.supervisor.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(res.statusCode).toBe(204)
  })

  it('returns 409 Conflict when the supervisor still has assigned premises (AC2)', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue({ id: 1, _count: { premises: 2 } })

    const handlers = getRouteHandlers(supervisorsRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(409)
    expect(res.body).toMatchObject({ status: 409 })
    expect(mockPrisma.supervisor.delete).not.toHaveBeenCalled()
  })
})
