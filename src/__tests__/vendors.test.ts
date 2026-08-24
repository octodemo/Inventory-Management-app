/**
 * Unit tests for src/routes/vendors.ts + src/services/vendorUsageService.ts
 *
 * Covers:
 * - issues/85-UNIT-TEST-vendor-usage-analysis-api.md
 *   (dependencies: 25-BACKEND-vendor-usage-analysis-api)
 */
import { createMockRequest, createMockResponse, getRouteHandlers, invokeRoute } from '../testSupport/routeHarness.js'

jest.mock('../lib/prisma.js', () => ({
  prisma: {
    vendor: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    usageRecord: {
      findMany: jest.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import vendorsRouter from '../routes/vendors.js'

const mockPrisma = prisma as unknown as {
  vendor: { findMany: jest.Mock; findUnique: jest.Mock }
  usageRecord: { findMany: jest.Mock }
}

describe('GET /api/vendors/:id/usage-analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns vendor details with usage data aggregated correctly (issue 85, AC1)', async () => {
    mockPrisma.vendor.findUnique.mockResolvedValue({ id: 1, name: 'Vendor A' })
    mockPrisma.usageRecord.findMany.mockResolvedValue([
      {
        itemId: 10,
        branchId: 100,
        quantity: 500,
        item: { id: 10, name: 'Item X', vendorId: 1 },
        branch: { id: 100, name: 'Branch 1' },
      },
      {
        itemId: 10,
        branchId: 200,
        quantity: 1000,
        item: { id: 10, name: 'Item X', vendorId: 1 },
        branch: { id: 200, name: 'Branch 2' },
      },
    ])

    const handlers = getRouteHandlers(vendorsRouter, 'get', '/:id/usage-analysis')
    const req = createMockRequest({ params: { id: '1' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(mockPrisma.vendor.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      vendor: { id: 1, name: 'Vendor A' },
      items: [
        {
          itemId: 10,
          itemName: 'Item X',
          totalQuantity: 1500,
          usageByBranch: [
            { branchId: 100, branchName: 'Branch 1', quantity: 500 },
            { branchId: 200, branchName: 'Branch 2', quantity: 1000 },
          ],
        },
      ],
      totalUsage: 1500,
    })
  })

  it('includes breakdown by branch and total quantity calculations across multiple items (issue 85, AC2)', async () => {
    mockPrisma.vendor.findUnique.mockResolvedValue({ id: 2, name: 'Vendor B' })
    mockPrisma.usageRecord.findMany.mockResolvedValue([
      {
        itemId: 20,
        branchId: 100,
        quantity: 300,
        item: { id: 20, name: 'Item Y', vendorId: 2 },
        branch: { id: 100, name: 'Branch 1' },
      },
      {
        itemId: 21,
        branchId: 100,
        quantity: 700,
        item: { id: 21, name: 'Item Z', vendorId: 2 },
        branch: { id: 100, name: 'Branch 1' },
      },
    ])

    const handlers = getRouteHandlers(vendorsRouter, 'get', '/:id/usage-analysis')
    const req = createMockRequest({ params: { id: '2' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(200)
    const body = res.body as { items: unknown[]; totalUsage: number }
    expect(body.items).toHaveLength(2)
    expect(body.totalUsage).toBe(1000)
    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ itemId: 20, totalQuantity: 300, usageByBranch: [{ branchId: 100, branchName: 'Branch 1', quantity: 300 }] }),
        expect.objectContaining({ itemId: 21, totalQuantity: 700, usageByBranch: [{ branchId: 100, branchName: 'Branch 1', quantity: 700 }] }),
      ])
    )
  })

  it('returns 404 when the vendor does not exist', async () => {
    mockPrisma.vendor.findUnique.mockResolvedValue(null)

    const handlers = getRouteHandlers(vendorsRouter, 'get', '/:id/usage-analysis')
    const req = createMockRequest({ params: { id: '999' } })
    const res = createMockResponse()

    await invokeRoute(handlers, req, res)

    expect(res.statusCode).toBe(404)
    expect(res.body).toMatchObject({ status: 404, message: expect.stringContaining('999') })
    expect(mockPrisma.usageRecord.findMany).not.toHaveBeenCalled()
  })
})
