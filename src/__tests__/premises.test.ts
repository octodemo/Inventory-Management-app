/**
 * Unit tests for src/routes/premises.ts + src/services/premisesService.ts
 *
 * Covers:
 * - issues/92-UNIT-TEST-premises-supervisor-assignment-api.md
 *   (dependencies: 32-BACKEND-premises-supervisor-assignment-api)
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
    premises: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    supervisor: {
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import premisesRouter from '../routes/premises.js'

const mockPrisma = prisma as unknown as {
  premises: {
    findMany: jest.Mock
    count: jest.Mock
    findUnique: jest.Mock
    create: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
  supervisor: { findUnique: jest.Mock }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/premises (issue 92, AC1)', () => {
  it('creates premises with a supervisor assignment and returns 201 Created', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue({ id: 1, name: 'Jane Doe' })
    mockPrisma.premises.create.mockResolvedValue({
      id: 100,
      name: 'Premises A',
      address: null,
      supervisorId: 1,
    })

    const handlers = getRouteHandlers(premisesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Premises A', supervisorId: 1 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.premises.create).toHaveBeenCalledWith({
      data: { name: 'Premises A', address: null, supervisorId: 1 },
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({ id: 100, supervisorId: 1 })
  })

  it('returns 400 Bad Request when the referenced supervisor does not exist', async () => {
    mockPrisma.supervisor.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(premisesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Premises B', supervisorId: 999 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(mockPrisma.premises.create).not.toHaveBeenCalled()
  })
})

describe('PUT /api/premises/:id (issue 92, AC2)', () => {
  it('allows changing the assigned supervisor and returns 200 OK', async () => {
    mockPrisma.premises.findUnique.mockResolvedValue({
      id: 100,
      name: 'Premises A',
      address: null,
      supervisorId: 1,
    })
    mockPrisma.supervisor.findUnique.mockResolvedValue({ id: 2, name: 'John Smith' })
    mockPrisma.premises.update.mockResolvedValue({
      id: 100,
      name: 'Premises A',
      address: null,
      supervisorId: 2,
    })

    const handlers = getRouteHandlers(premisesRouter, 'put', '/:id')
    const req = createMockRequest({ params: { id: '100' }, body: { supervisorId: 2 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.premises.update).toHaveBeenCalledWith({
      where: { id: 100 },
      data: { name: 'Premises A', address: null, supervisorId: 2 },
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({ supervisorId: 2 })
  })

  it('returns 400 Bad Request when the new supervisorId does not exist', async () => {
    mockPrisma.premises.findUnique.mockResolvedValue({
      id: 100,
      name: 'Premises A',
      address: null,
      supervisorId: 1,
    })
    mockPrisma.supervisor.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(premisesRouter, 'put', '/:id')
    const req = createMockRequest({ params: { id: '100' }, body: { supervisorId: 999 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(mockPrisma.premises.update).not.toHaveBeenCalled()
  })

  it('returns 404 Not Found when the premises does not exist', async () => {
    mockPrisma.premises.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(premisesRouter, 'put', '/:id')
    const req = createMockRequest({ params: { id: '999' }, body: { supervisorId: 2 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(404)
  })
})
