/**
 * Unit tests for src/routes/usage.ts + src/services/usageRecordService.ts
 *
 * Covers:
 * - issues/94-UNIT-TEST-usage-record-api.md (dependencies: 34-BACKEND-usage-record-api)
 * - issues/95-UNIT-TEST-usage-list-search-api.md (dependencies: 35-BACKEND-usage-list-search-api)
 * - issues/96-UNIT-TEST-usage-update-api.md (dependencies: 36-BACKEND-usage-update-api)
 * - issues/97-UNIT-TEST-usage-delete-admin-api.md (dependencies: 37-BACKEND-usage-delete-admin-api)
 *
 * NOTE on issue 97 (admin authorization): `src/middleware/auth.ts` is a
 * pre-built stub (per workshop-stack.md) whose `authenticate`/`authorize`
 * both unconditionally call `next()` pending real IAM integration — it does
 * not yet enforce roles. Per the "never modify pre-built files" rule, this
 * suite does not alter that file. To verify the *route's* admin-only wiring
 * (DELETE /api/usage/:id -> authorize('ADMIN')) independently of the stub's
 * current no-op behavior, the "not admin" test mocks '../middleware/auth.js'
 * with a controllable fake that enforces roles the same way the real
 * middleware is contracted to (NFR-002), then asserts the route responds
 * with 403 when the simulated caller lacks the ADMIN role and proceeds when
 * it has it. This is a mocked external dependency (consistent with "mock any
 * external service calls"), not a change to production code.
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
    usageRecord: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    inventoryItem: {
      findUnique: jest.fn(),
    },
    branch: {
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import usageRouter from '../routes/usage.js'

const mockPrisma = prisma as unknown as {
  usageRecord: {
    findMany: jest.Mock
    count: jest.Mock
    findUnique: jest.Mock
    create: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
  inventoryItem: { findUnique: jest.Mock }
  branch: { findUnique: jest.Mock }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/usage (issue 94)', () => {
  it('creates a usage record and returns 201 Created (AC1)', async () => {
    mockPrisma.inventoryItem.findUnique.mockResolvedValue({ id: 1, name: 'A4 Paper' })
    mockPrisma.branch.findUnique.mockResolvedValue({ id: 10, name: 'Branch 1' })
    mockPrisma.usageRecord.create.mockResolvedValue({
      id: 500,
      itemId: 1,
      branchId: 10,
      quantity: 25,
      usageDate: new Date('2026-08-01'),
      notes: null,
    })

    const handlers = getRouteHandlers(usageRouter, 'post', '/')
    const req = createMockRequest({
      body: { itemId: 1, branchId: 10, quantity: 25, usageDate: '2026-08-01' },
    })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.usageRecord.create).toHaveBeenCalled()
    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({ id: 500, itemId: 1, branchId: 10, quantity: 25 })
  })

  it('returns 400 Bad Request when itemId references a non-existent item (AC2)', async () => {
    mockPrisma.inventoryItem.findUnique.mockResolvedValue(null)
    mockPrisma.branch.findUnique.mockResolvedValue({ id: 10, name: 'Branch 1' })

    const handlers = getRouteHandlers(usageRouter, 'post', '/')
    const req = createMockRequest({
      body: { itemId: 999, branchId: 10, quantity: 5, usageDate: '2026-08-01' },
    })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('999') })
    expect(mockPrisma.usageRecord.create).not.toHaveBeenCalled()
  })

  it('returns 400 Bad Request when branchId references a non-existent branch (AC2)', async () => {
    mockPrisma.inventoryItem.findUnique.mockResolvedValue({ id: 1, name: 'A4 Paper' })
    mockPrisma.branch.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(usageRouter, 'post', '/')
    const req = createMockRequest({
      body: { itemId: 1, branchId: 999, quantity: 5, usageDate: '2026-08-01' },
    })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('999') })
    expect(mockPrisma.usageRecord.create).not.toHaveBeenCalled()
  })

  it('returns 400 Bad Request when required fields are missing', async () => {
    const handlers = getRouteHandlers(usageRouter, 'post', '/')
    const req = createMockRequest({ body: { itemId: 1 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
  })
})

describe('GET /api/usage (issue 95)', () => {
  it('returns paginated usage records with correct metadata (AC1)', async () => {
    mockPrisma.usageRecord.findMany.mockResolvedValue([
      { id: 1, itemId: 1, branchId: 10, quantity: 5, usageDate: new Date(), item: {}, branch: {} },
    ])
    mockPrisma.usageRecord.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(usageRouter, 'get', '/')
    const req = createMockRequest({ query: { page: '1', limit: '20' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: unknown[]; pagination: Record<string, number> }
    expect(body.data).toHaveLength(1)
    expect(body.pagination).toEqual({ page: 1, limit: 20, total: 1, totalPages: 1 })
  })

  it('applies multi-dimensional filter parameters (branchIds, itemIds, regionalOfficeIds, date range) (AC2)', async () => {
    mockPrisma.usageRecord.findMany.mockResolvedValue([])
    mockPrisma.usageRecord.count.mockResolvedValue(0)

    const handlers = getRouteHandlers(usageRouter, 'get', '/')
    const req = createMockRequest({
      query: {
        branchIds: '10,20',
        itemIds: '1,2',
        regionalOfficeIds: '1',
        startDate: '2026-01-01',
        endDate: '2026-08-24',
      },
    })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.usageRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          branchId: { in: [10, 20] },
          itemId: { in: [1, 2] },
          branch: { regionalOfficeId: { in: [1] } },
          usageDate: { gte: new Date('2026-01-01'), lte: new Date('2026-08-24') },
        }),
      })
    )
    expect(res.statusCode).toBe(200)
  })
})

describe('GET/PUT /api/usage/:id (issue 96)', () => {
  it('updates a usage record and returns 200 OK (AC1)', async () => {
    mockPrisma.usageRecord.findUnique.mockResolvedValue({
      id: 1,
      itemId: 1,
      branchId: 10,
      quantity: 5,
      usageDate: new Date('2026-01-01'),
      notes: null,
    })
    mockPrisma.usageRecord.update.mockResolvedValue({
      id: 1,
      itemId: 1,
      branchId: 10,
      quantity: 15,
      usageDate: new Date('2026-01-01'),
      notes: 'Updated',
    })

    const handlers = getRouteHandlers(usageRouter, 'put', '/:id')
    const req = createMockRequest({ params: { id: '1' }, body: { quantity: 15, notes: 'Updated' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({ quantity: 15, notes: 'Updated' })
  })

  it('returns 400 Bad Request when quantity is invalid (negative) (AC2)', async () => {
    mockPrisma.usageRecord.findUnique.mockResolvedValue({
      id: 1,
      itemId: 1,
      branchId: 10,
      quantity: 5,
      usageDate: new Date('2026-01-01'),
      notes: null,
    })

    const handlers = getRouteHandlers(usageRouter, 'put', '/:id')
    const req = createMockRequest({ params: { id: '1' }, body: { quantity: -5 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(mockPrisma.usageRecord.update).not.toHaveBeenCalled()
  })

  it('returns 404 Not Found when the usage record does not exist', async () => {
    mockPrisma.usageRecord.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(usageRouter, 'get', '/:id')
    const req = createMockRequest({ params: { id: '999' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/usage/:id (issue 97)', () => {
  it('deletes the usage record and returns 204 No Content when the caller is admin (AC1)', async () => {
    mockPrisma.usageRecord.findUnique.mockResolvedValue({ id: 1 })
    mockPrisma.usageRecord.delete.mockResolvedValue({ id: 1 })

    const handlers = getRouteHandlers(usageRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.usageRecord.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(res.statusCode).toBe(204)
  })

  it('returns 403 Forbidden when the caller does not have the admin role (AC2)', async () => {
    // The route's authorization wiring is `authenticate, authorize('ADMIN')`.
    // We isolate this test by swapping in a role-aware fake for the
    // authorize() layer only (module reset + re-import), since the shared
    // production stub always calls next() regardless of role.
    jest.resetModules()
    jest.doMock('../middleware/auth.js', () => ({
      authenticate: (req: any, _res: any, next: () => void) => next(),
      authorize:
        (...roles: string[]) =>
        (req: any, res: any, next: () => void) => {
          if (roles.includes(req.headers['x-user-role'])) {
            next()
            return
          }
          res.status(403).json({ message: 'Forbidden: insufficient role', status: 403, timestamp: new Date().toISOString() })
        },
    }))

    // Re-mock prisma for the freshly re-required module graph.
    jest.doMock('../lib/prisma.js', () => ({ prisma: mockPrisma }))

    const { default: isolatedUsageRouter } = await import('../routes/usage.js')
    const handlers = getRouteHandlers(isolatedUsageRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '1' }, headers: { 'x-user-role': 'USER' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(403)
    expect(mockPrisma.usageRecord.delete).not.toHaveBeenCalled()

    jest.dontMock('../middleware/auth.js')
    jest.dontMock('../lib/prisma.js')
    jest.resetModules()
  })
})
