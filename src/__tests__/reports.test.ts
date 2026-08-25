/**
 * Unit tests for src/routes/reports.ts + src/services/reportsService.ts
 *
 * Covers:
 * - issues/87-UNIT-TEST-vendor-drill-down-api.md (dependencies: 27-BACKEND-vendor-drill-down-api)
 * - issues/98-UNIT-TEST-branch-usage-filter-api.md (dependencies: 38-BACKEND-branch-usage-filter-api)
 * - issues/99-UNIT-TEST-branch-usage-summary-api.md (dependencies: 39-BACKEND-branch-usage-summary-api)
 * - issues/100-UNIT-TEST-regional-office-usage-filter-api.md (dependencies: 40-BACKEND-regional-office-usage-filter-api)
 * - issues/101-UNIT-TEST-regional-office-usage-summary-api.md (dependencies: 41-BACKEND-regional-office-usage-summary-api)
 * - issues/102-UNIT-TEST-multi-select-items-api.md (dependencies: 42-BACKEND-multi-select-items-api)
 * - issues/103-UNIT-TEST-multi-select-branches-api.md (dependencies: 43-BACKEND-multi-select-branches-api)
 * - issues/104-UNIT-TEST-multi-select-vendors-api.md (dependencies: 44-BACKEND-multi-select-vendors-api)
 * - issues/105-UNIT-TEST-tabular-report-format-api.md (dependencies: 45-BACKEND-tabular-report-format-api)
 * - issues/106-UNIT-TEST-report-pagination-api.md (dependencies: 46-BACKEND-report-pagination-api)
 * - issues/107-UNIT-TEST-report-column-sorting-api.md (dependencies: 47-BACKEND-report-column-sorting-api)
 * - issues/108-UNIT-TEST-hierarchy-based-report-api.md (dependencies: 48-BACKEND-hierarchy-based-report-api)
 * - issues/109-UNIT-TEST-hierarchy-drill-down-api.md (dependencies: 49-BACKEND-hierarchy-drill-down-api)
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
    usageRecord: { findMany: jest.fn() },
    inventoryItem: { count: jest.fn() },
    branch: { count: jest.fn() },
    vendor: { count: jest.fn() },
    regionalOffice: { count: jest.fn() },
    itemHierarchy: { count: jest.fn(), findUnique: jest.fn() },
  },
}))

import { prisma } from '../lib/prisma.js'
import reportsRouter from '../routes/reports.js'

const mockPrisma = prisma as unknown as {
  usageRecord: { findMany: jest.Mock }
  inventoryItem: { count: jest.Mock }
  branch: { count: jest.Mock }
  vendor: { count: jest.Mock }
  regionalOffice: { count: jest.Mock }
  itemHierarchy: { count: jest.Mock; findUnique: jest.Mock }
}

/** Builds a raw UsageRecord row (with the relations reportsService expects) for mocking `findMany`. */
function makeRecord(overrides: {
  itemId: number
  itemName: string
  vendorId: number
  vendorName: string
  hierarchyId: number
  hierarchyName: string
  branchId: number
  branchName: string
  regionalOfficeId: number
  regionalOfficeName: string
  quantity: number
  usageDate?: Date
}) {
  return {
    id: Math.floor(Math.random() * 100000),
    itemId: overrides.itemId,
    branchId: overrides.branchId,
    quantity: overrides.quantity,
    usageDate: overrides.usageDate ?? new Date('2026-03-01'),
    notes: null,
    item: {
      id: overrides.itemId,
      name: overrides.itemName,
      vendorId: overrides.vendorId,
      hierarchyId: overrides.hierarchyId,
      vendor: { id: overrides.vendorId, name: overrides.vendorName },
      hierarchy: { id: overrides.hierarchyId, name: overrides.hierarchyName, parentId: null },
    },
    branch: {
      id: overrides.branchId,
      name: overrides.branchName,
      regionalOfficeId: overrides.regionalOfficeId,
      regionalOffice: { id: overrides.regionalOfficeId, name: overrides.regionalOfficeName },
    },
  }
}

const SAMPLE_RECORDS = [
  makeRecord({
    itemId: 1,
    itemName: 'A4 Paper',
    vendorId: 10,
    vendorName: 'Vendor A',
    hierarchyId: 100,
    hierarchyName: 'Paper Products',
    branchId: 500,
    branchName: 'Branch 1',
    regionalOfficeId: 1,
    regionalOfficeName: 'North Zone',
    quantity: 300,
  }),
  makeRecord({
    itemId: 1,
    itemName: 'A4 Paper',
    vendorId: 10,
    vendorName: 'Vendor A',
    hierarchyId: 100,
    hierarchyName: 'Paper Products',
    branchId: 501,
    branchName: 'Branch 2',
    regionalOfficeId: 1,
    regionalOfficeName: 'North Zone',
    quantity: 200,
  }),
  makeRecord({
    itemId: 2,
    itemName: 'Blue Pen',
    vendorId: 11,
    vendorName: 'Vendor B',
    hierarchyId: 101,
    hierarchyName: 'Writing Instruments',
    branchId: 502,
    branchName: 'Branch 3',
    regionalOfficeId: 2,
    regionalOfficeName: 'South Zone',
    quantity: 500,
  }),
]

/**
 * Mimics Prisma's `where` filtering over the in-memory SAMPLE_RECORDS, since
 * `findMany` is fully mocked (no real database). Supports exactly the
 * `where` shape built by `fetchFilteredUsageRecords` in reportsService.ts.
 */
function applyWhere(where: Record<string, any>) {
  return SAMPLE_RECORDS.filter((record) => {
    if (where.itemId && !where.itemId.in.includes(record.itemId)) return false
    if (where.branchId && !where.branchId.in.includes(record.branchId)) return false
    if (where.usageDate) {
      if (where.usageDate.gte && record.usageDate < where.usageDate.gte) return false
      if (where.usageDate.lte && record.usageDate > where.usageDate.lte) return false
    }
    if (where.item) {
      if (where.item.vendorId && !where.item.vendorId.in.includes(record.item.vendorId)) return false
      if (where.item.hierarchyId && !where.item.hierarchyId.in.includes(record.item.hierarchyId)) return false
    }
    if (where.branch?.regionalOfficeId && !where.branch.regionalOfficeId.in.includes(record.branch.regionalOfficeId)) {
      return false
    }
    return true
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockPrisma.usageRecord.findMany.mockImplementation(({ where }: { where: Record<string, any> }) =>
    Promise.resolve(applyWhere(where))
  )
  // No filter ids supplied by default -> counts irrelevant, but keep resolved.
  mockPrisma.inventoryItem.count.mockResolvedValue(0)
  mockPrisma.branch.count.mockResolvedValue(0)
  mockPrisma.vendor.count.mockResolvedValue(0)
  mockPrisma.regionalOffice.count.mockResolvedValue(0)
  mockPrisma.itemHierarchy.count.mockResolvedValue(0)
  mockPrisma.itemHierarchy.findUnique.mockImplementation(({ where: { id } }: { where: { id: number } }) =>
    Promise.resolve({ id, parentId: null })
  )
})

const REPORT_ROUTES: Array<{ path: string; label: string }> = [
  { path: '/item-wise', label: 'item-wise' },
  { path: '/branch-wise', label: 'branch-wise' },
  { path: '/regional-office-wise', label: 'regional-office-wise' },
  { path: '/hierarchy-wise', label: 'hierarchy-wise' },
  { path: '/vendor-wise', label: 'vendor-wise' },
]

describe('Tabular report format - all report endpoints (issue 105)', () => {
  it.each(REPORT_ROUTES)('POST /api/reports$path returns a data array and column metadata (AC1, AC2)', async ({ path }) => {
    const handlers = getRouteHandlers(reportsRouter, 'post', path)
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: unknown[]; columns: Array<{ field: string; label: string; type: string }> }
    expect(Array.isArray(body.data)).toBe(true)
    expect(Array.isArray(body.columns)).toBe(true)
    expect(body.columns.length).toBeGreaterThan(0)
    for (const column of body.columns) {
      expect(column).toEqual(
        expect.objectContaining({
          field: expect.any(String),
          label: expect.any(String),
          type: expect.stringMatching(/^(string|number|date)$/),
        })
      )
    }
  })
})

describe('Report pagination - all report endpoints (issue 106)', () => {
  it.each(REPORT_ROUTES)(
    'POST /api/reports$path accepts page/limit and returns pagination metadata (AC1, AC2)',
    async ({ path }) => {
      const handlers = getRouteHandlers(reportsRouter, 'post', path)
      const req = createMockRequest({ body: { page: 1, limit: 2 } })
      const res = createMockResponse()

      await invokeRoute(handlers, req, res)

      expect(res.statusCode).toBe(200)
      const body = res.body as { data: unknown[]; pagination: { page: number; limit: number; total: number; totalPages: number } }
      expect(body.pagination).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 2,
          total: expect.any(Number),
          totalPages: expect.any(Number),
        })
      )
      expect(body.data.length).toBeLessThanOrEqual(2)
    }
  )
})

describe('Report column sorting - all report endpoints (issue 107)', () => {
  it('POST /api/reports/item-wise sorts by totalQuantity ascending/descending (AC1)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/item-wise')

    const ascRes = createMockResponse()
    await invokeRoute(handlers, createMockRequest({ body: { orderBy: 'totalQuantity', direction: 'asc' } }), ascRes)
    const ascBody = ascRes.body as { data: Array<{ totalQuantity: number }> }
    const ascValues = ascBody.data.map((row) => row.totalQuantity)
    expect(ascValues).toEqual([...ascValues].sort((a, b) => a - b))

    const descRes = createMockResponse()
    await invokeRoute(handlers, createMockRequest({ body: { orderBy: 'totalQuantity', direction: 'desc' } }), descRes)
    const descBody = descRes.body as { data: Array<{ totalQuantity: number }> }
    const descValues = descBody.data.map((row) => row.totalQuantity)
    expect(descValues).toEqual([...descValues].sort((a, b) => b - a))
  })

  it.each(REPORT_ROUTES)(
    'POST /api/reports$path returns 400 Bad Request when orderBy references an invalid column (AC2)',
    async ({ path }) => {
      const handlers = getRouteHandlers(reportsRouter, 'post', path)
      const req = createMockRequest({ body: { orderBy: 'not_a_real_column' } })
      const res = createMockResponse()

      await invokeRoute(handlers, req, res)

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('not_a_real_column') })
    }
  )
})

describe('POST /api/reports/item-wise - multi-select items (issue 102)', () => {
  it('filters results correctly when itemIds array is supplied (AC1)', async () => {
    mockPrisma.inventoryItem.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/item-wise')
    const req = createMockRequest({ body: { itemIds: [1] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.inventoryItem.count).toHaveBeenCalledWith({ where: { id: { in: [1] } } })
    expect(mockPrisma.usageRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ itemId: { in: [1] } }) })
    )
    expect(res.statusCode).toBe(200)
  })

  it('returns 400 Bad Request when itemIds contains invalid IDs (AC2)', async () => {
    // Only 1 of the 2 requested ids exists.
    mockPrisma.inventoryItem.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/item-wise')
    const req = createMockRequest({ body: { itemIds: [1, 999] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('itemIds') })
    expect(mockPrisma.usageRecord.findMany).not.toHaveBeenCalled()
  })
})

describe('POST /api/reports/branch-wise - branch filtering, multi-select, and summary (issues 98, 99, 103)', () => {
  it('with branchIds filter returns only data for specified branches, aggregated per branch (issue 98, AC1 + AC2)', async () => {
    mockPrisma.branch.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/branch-wise')
    const req = createMockRequest({ body: { branchIds: [500] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.usageRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ branchId: { in: [500] } }) })
    )
    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ branchId: number; branchName: string; totalQuantity: number; itemCount: number }> }
    expect(body.data).toEqual([
      expect.objectContaining({ branchId: 500, branchName: 'Branch 1', totalQuantity: 300, itemCount: 1 }),
    ])
  })

  it('response includes branch-level summary (totalQuantity, itemCount) and overall summary across selected branches (issue 99, AC1 + AC2)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/branch-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as {
      data: Array<{ totalQuantity: number; itemCount: number }>
      summary: { totalQuantity: number; branchCount: number }
    }
    expect(body.data.every((row) => typeof row.totalQuantity === 'number' && typeof row.itemCount === 'number')).toBe(
      true
    )
    expect(body.summary).toEqual({ totalQuantity: 1000, branchCount: 3 })
  })

  it('with branchIds array filters results correctly for multiple branches (issue 103, AC1)', async () => {
    mockPrisma.branch.count.mockResolvedValue(2)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/branch-wise')
    const req = createMockRequest({ body: { branchIds: [500, 501] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ branchId: number }> }
    expect(body.data.map((row) => row.branchId).sort()).toEqual([500, 501])
  })

  it('returns 400 Bad Request when branchIds contains invalid IDs (issue 103, AC2)', async () => {
    mockPrisma.branch.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/branch-wise')
    const req = createMockRequest({ body: { branchIds: [500, 999] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('branchIds') })
  })
})

describe('POST /api/reports/regional-office-wise - filtering, aggregation, and summary (issues 100, 101)', () => {
  it('with regionalOfficeIds filter returns aggregated usage across the office branches (issue 100, AC1)', async () => {
    mockPrisma.regionalOffice.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/regional-office-wise')
    const req = createMockRequest({ body: { regionalOfficeIds: [1] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.usageRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ branch: { regionalOfficeId: { in: [1] } } }) })
    )
    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ regionalOfficeId: number; totalQuantity: number; branchCount: number }> }
    expect(body.data).toEqual([
      expect.objectContaining({ regionalOfficeId: 1, totalQuantity: 500, branchCount: 2 }),
    ])
  })

  it('aggregation correctly joins Branch and UsageRecord by regional office (issue 100, AC2)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/regional-office-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ regionalOfficeId: number; regionalOfficeName: string }> }
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ regionalOfficeId: 1, regionalOfficeName: 'North Zone' }),
        expect.objectContaining({ regionalOfficeId: 2, regionalOfficeName: 'South Zone' }),
      ])
    )
  })

  it('response includes regional-office-level summary (totalQuantity, branchCount) (issue 101, AC1)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/regional-office-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { summary: { totalQuantity: number; regionalOfficeCount: number } }
    expect(body.summary).toEqual({ totalQuantity: 1000, regionalOfficeCount: 2 })
  })

  it('response includes a breakdown by branch within each regional office (issue 101, AC2)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/regional-office-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    const body = res.body as { data: Array<{ regionalOfficeId: number; branches: Array<{ branchId: number; quantity: number }> }> }
    const northZone = body.data.find((row) => row.regionalOfficeId === 1)
    expect(northZone?.branches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ branchId: 500, quantity: 300 }),
        expect.objectContaining({ branchId: 501, quantity: 200 }),
      ])
    )
  })
})

describe('POST /api/reports/hierarchy-wise - aggregation and drill-down (issues 108, 109)', () => {
  it('returns usage data aggregated by hierarchy node (issue 108, AC1)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/hierarchy-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ hierarchyId: number; hierarchyName: string; totalQuantity: number }> }
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ hierarchyId: 100, hierarchyName: 'Paper Products', totalQuantity: 500 }),
        expect.objectContaining({ hierarchyId: 101, hierarchyName: 'Writing Instruments', totalQuantity: 500 }),
      ])
    )
  })

  it('aggregation correctly includes all items within each hierarchy node (issue 108, AC2)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/hierarchy-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    const body = res.body as { data: Array<{ hierarchyId: number; items: Array<{ itemId: number }> }> }
    const paperProducts = body.data.find((row) => row.hierarchyId === 100)
    expect(paperProducts?.items).toEqual([expect.objectContaining({ itemId: 1, itemName: 'A4 Paper', quantity: 500 })])
  })

  it('response includes an items array for each node with correct structure (issue 109, AC1)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/hierarchy-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    const body = res.body as { data: Array<{ items: Array<{ itemId: number; itemName: string; quantity: number }> }> }
    for (const row of body.data) {
      expect(Array.isArray(row.items)).toBe(true)
      for (const item of row.items) {
        expect(item).toEqual(
          expect.objectContaining({ itemId: expect.any(Number), itemName: expect.any(String), quantity: expect.any(Number) })
        )
      }
    }
  })

  it('drill-down allows filtering to specific items within a hierarchy node via itemIds (issue 109, AC2)', async () => {
    mockPrisma.inventoryItem.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/hierarchy-wise')
    const req = createMockRequest({ body: { itemIds: [1] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ hierarchyId: number; items: Array<{ itemId: number }> }> }
    expect(body.data).toHaveLength(1)
    expect(body.data[0].hierarchyId).toBe(100)
    expect(body.data[0].items).toEqual([expect.objectContaining({ itemId: 1 })])
  })
})

describe('POST /api/reports/vendor-wise - drill-down and multi-select vendors (issues 87, 104)', () => {
  it('response includes an items array for each vendor with correct structure (issue 87, AC1)', async () => {
    const handlers = getRouteHandlers(reportsRouter, 'post', '/vendor-wise')
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ vendorId: number; items: Array<{ itemId: number; usageByBranch: unknown[] }> }> }
    const vendorA = body.data.find((row) => row.vendorId === 10)
    expect(vendorA?.items).toEqual([
      expect.objectContaining({
        itemId: 1,
        itemName: 'A4 Paper',
        totalQuantity: 500,
        usageByBranch: expect.arrayContaining([
          expect.objectContaining({ branchId: 500, quantity: 300 }),
          expect.objectContaining({ branchId: 501, quantity: 200 }),
        ]),
      }),
    ])
  })

  it('drill-down allows filtering to specific items within a vendor via itemIds (issue 87, AC2)', async () => {
    mockPrisma.inventoryItem.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/vendor-wise')
    const req = createMockRequest({ body: { itemIds: [1] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ vendorId: number; items: Array<{ itemId: number }> }> }
    expect(body.data).toHaveLength(1)
    expect(body.data[0].vendorId).toBe(10)
  })

  it('with vendorIds array filters results correctly for multiple vendors (issue 104, AC1)', async () => {
    mockPrisma.vendor.count.mockResolvedValue(2)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/vendor-wise')
    const req = createMockRequest({ body: { vendorIds: [10, 11] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { data: Array<{ vendorId: number }> }
    expect(body.data.map((row) => row.vendorId).sort()).toEqual([10, 11])
  })

  it('returns 400 Bad Request when vendorIds contains invalid IDs (issue 104, AC2)', async () => {
    mockPrisma.vendor.count.mockResolvedValue(1)

    const handlers = getRouteHandlers(reportsRouter, 'post', '/vendor-wise')
    const req = createMockRequest({ body: { vendorIds: [10, 999] } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ status: 400, message: expect.stringContaining('vendorIds') })
  })
})
