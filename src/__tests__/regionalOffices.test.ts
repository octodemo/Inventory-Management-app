/**
 * Unit tests for src/routes/regionalOffices.ts + src/services/regionalOfficeService.ts
 *
 * Covers:
 * - issues/88-UNIT-TEST-regional-office-api.md (dependencies: 28-BACKEND-regional-office-api)
 * - issues/90-UNIT-TEST-regional-office-delete-validation-api.md (dependencies: 30-BACKEND-regional-office-delete-validation-api)
 */
import { createMockRequest, createMockResponse, getRouteHandlers, invokeRoute } from '../testSupport/routeHarness.js'

jest.mock('../lib/prisma.js', () => ({
  prisma: {
    regionalOffice: {
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
import regionalOfficesRouter from '../routes/regionalOffices.js'

const mockPrisma = prisma as unknown as {
  regionalOffice: {
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

describe('POST /api/regional-offices (issue 88)', () => {
  it('creates a regional office with a unique code and returns 201 Created (AC1)', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue(null)
    mockPrisma.regionalOffice.create.mockResolvedValue({
      id: 1,
      name: 'North Zone',
      code: 'NZ-01',
      address: null,
    })

    const handlers = getRouteHandlers(regionalOfficesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'North Zone', code: 'NZ-01' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.regionalOffice.create).toHaveBeenCalledWith({
      data: { name: 'North Zone', code: 'NZ-01', address: null },
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ id: 1, name: 'North Zone', code: 'NZ-01', address: null })
  })

  it('returns 400 Bad Request when the code is already in use', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue({ id: 9, code: 'NZ-01' })

    const handlers = getRouteHandlers(regionalOfficesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Duplicate', code: 'NZ-01' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('NZ-01') })
    expect(mockPrisma.regionalOffice.create).not.toHaveBeenCalled()
  })

  it('returns 400 Bad Request when required fields are missing', async () => {
    const handlers = getRouteHandlers(regionalOfficesRouter, 'post', '/')
    const req = createMockRequest({ body: { name: 'Missing Code' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
  })
})

describe('GET /api/regional-offices (issue 88)', () => {
  it('returns a paginated list with branch counts (AC2)', async () => {
    mockPrisma.regionalOffice.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'North Zone',
        code: 'NZ-01',
        address: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        _count: { branches: 5 },
      },
    ])
    mockPrisma.regionalOffice.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(regionalOfficesRouter, 'get', '/')
    const req = createMockRequest({ query: { page: '1', limit: '20' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ branchCount: number }>; pagination: Record<string, number> }
    expect(body.data).toHaveLength(1)
    expect(body.data[0].branchCount).toBe(5)
    expect(body.pagination).toEqual({ page: 1, limit: 20, total: 1, totalPages: 1 })
  })
})

describe('DELETE /api/regional-offices/:id (issue 90)', () => {
  it('deletes the regional office and returns 204 No Content when no branches exist (AC1)', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue({ id: 1, _count: { branches: 0 } })
    mockPrisma.regionalOffice.delete.mockResolvedValue({ id: 1 })

    const handlers = getRouteHandlers(regionalOfficesRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.regionalOffice.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(res.statusCode).toBe(204)
    expect(res.send).toHaveBeenCalled()
  })

  it('returns 409 Conflict when branches still reference the office (AC2)', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue({ id: 1, _count: { branches: 3 } })

    const handlers = getRouteHandlers(regionalOfficesRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(409)
    expect(res.body).toMatchObject({ status: 409, message: expect.stringContaining('3') })
    expect(mockPrisma.regionalOffice.delete).not.toHaveBeenCalled()
  })

  it('returns 404 Not Found when the regional office does not exist', async () => {
    mockPrisma.regionalOffice.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(regionalOfficesRouter, 'delete', '/:id')
    const req = createMockRequest({ params: { id: '999' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(404)
  })
})
