/**
 * Unit tests for src/routes/branches.ts + src/services/branchService.ts
 *
 * Covers:
 * - issues/89-UNIT-TEST-branch-api.md (dependencies: 29-BACKEND-branch-api)
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
    branch: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    regionalOffice: {
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import branchesRouter from '../routes/branches.js'

const mockPrisma = prisma as unknown as {
  branch: {
    findMany: jest.Mock
    count: jest.Mock
    findUnique: jest.Mock
    create: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
  regionalOffice: { findUnique: jest.Mock }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/branches (issue 89, AC1)', () => {
  it('creates a branch linked to an existing regional office and returns 201 Created', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue({ id: 1, name: 'North Zone' })
    mockPrisma.branch.findUnique.mockResolvedValue(null)
    mockPrisma.branch.create.mockResolvedValue({
      id: 10,
      name: 'Branch 1',
      code: 'BR-01',
      regionalOfficeId: 1,
      address: null,
    })

    const handlers = getRouteHandlers(branchesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Branch 1', code: 'BR-01', regionalOfficeId: 1 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.branch.create).toHaveBeenCalledWith({
      data: { name: 'Branch 1', code: 'BR-01', regionalOfficeId: 1, address: null },
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({ id: 10, regionalOfficeId: 1 })
  })

  it('returns 400 Bad Request when the referenced regional office does not exist', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(branchesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Branch X', code: 'BR-99', regionalOfficeId: 999 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(mockPrisma.branch.create).not.toHaveBeenCalled()
  })

  it('returns 400 Bad Request when the branch code is already in use', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue({ id: 1 })
    mockPrisma.branch.findUnique.mockResolvedValue({ id: 5, code: 'BR-01' })

    const handlers = getRouteHandlers(branchesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Branch 1', code: 'BR-01', regionalOfficeId: 1 } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(mockPrisma.branch.create).not.toHaveBeenCalled()
  })
})

describe('GET /api/branches?regionalOfficeId= (issue 89, AC2)', () => {
  it('returns only branches matching the regionalOfficeId filter', async () => {
    mockPrisma.branch.findMany.mockResolvedValue([
      {
        id: 10,
        name: 'Branch 1',
        code: 'BR-01',
        address: null,
        regionalOfficeId: 1,
        regionalOffice: { name: 'North Zone' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    mockPrisma.branch.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(branchesRouter, 'get', '/')
    const req = createMockRequest({ query: { regionalOfficeId: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.branch.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { regionalOfficeId: 1 } })
    )
    expect(mockPrisma.branch.count).toHaveBeenCalledWith({ where: { regionalOfficeId: 1 } })
    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ regionalOfficeId: number }> }
    expect(body.data).toHaveLength(1)
    expect(body.data[0].regionalOfficeId).toBe(1)
  })

  it('returns all branches (no filter) when regionalOfficeId is omitted', async () => {
    mockPrisma.branch.findMany.mockResolvedValue([])
    mockPrisma.branch.count.mockResolvedValue(0)

    const handlers = getRouteHandlers(branchesRouter, 'get', '/')
    const req = createMockRequest({ query: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.branch.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }))
    expect(res.statusCode).toBe(200)
  })
})

describe('DELETE /api/branches/:id', () => {
  it('returns 404 Not Found when the branch does not exist', async () => {
    mockPrisma.branch.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(branchesRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '999' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(404)
  })

  it('deletes the branch and returns 204 No Content', async () => {
    mockPrisma.branch.findUnique.mockResolvedValue({ id: 10 })
    mockPrisma.branch.delete.mockResolvedValue({ id: 10 })

    const handlers = getRouteHandlers(branchesRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '10' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(204)
  })
})
