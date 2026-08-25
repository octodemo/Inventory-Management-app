import { NextFunction, Request, Response } from 'express'
import { getDashboardHandler } from '../routes/dashboardRoutes'
import { DashboardService, UsageRecordData } from '../services/dashboardService'

const records: UsageRecordData[] = [
  {
    itemId: 1,
    quantity: 10,
    usageDate: new Date('2026-08-10T00:00:00Z'),
    item: { name: 'Blue Ballpoint Pen', vendor: { id: 1, name: 'Office Supplies Co' }, rates: [{ rate: 5, effectiveFrom: new Date('2026-01-01'), effectiveTo: null }] },
    branch: { regionalOffice: { id: 1, name: 'North Regional Office' } },
  },
  {
    itemId: 2,
    quantity: 3,
    usageDate: new Date('2026-07-10T00:00:00Z'),
    item: { name: 'A4 Copy Paper', vendor: { id: 2, name: 'Paper Products Ltd' }, rates: [{ rate: 275, effectiveFrom: new Date('2026-01-01'), effectiveTo: null }] },
    branch: { regionalOffice: { id: 2, name: 'South Regional Office' } },
  },
]

const service = new DashboardService({
  findUsageRecords: async (startDate, endDate) => records.filter((record) => record.usageDate >= startDate && record.usageDate <= endDate),
}, () => new Date('2026-08-24T12:00:00Z'))

const response = () => {
  const result: { statusCode: number; body?: unknown } = { statusCode: 200 }
  interface MockResponse {
    status: jest.Mock<MockResponse, [number]>
    json: jest.Mock<MockResponse, [unknown]>
  }
  const res = {} as MockResponse
  res.status = jest.fn((statusCode: number) => {
      result.statusCode = statusCode
      return res
    })
  res.json = jest.fn((body: unknown) => {
      result.body = body
      return res
    })
  return { res: res as unknown as Response, result }
}

describe('GET /api/dashboard', () => {
  it('returns filtered widget data including a six-month chronological trend', async () => {
    const { res, result } = response()
    await getDashboardHandler(service)(
      { query: { startDate: '2026-08-01', endDate: '2026-08-31' } } as unknown as Request,
      res,
      jest.fn() as NextFunction,
    )

    expect(result.statusCode).toBe(200)
    expect(result.body).toMatchObject({
      totalUsage: { currentMonth: 10, previousMonth: 3, changePercent: 233.3 },
      topItems: [{ itemId: 1, itemName: 'Blue Ballpoint Pen', quantity: 10 }],
      regionalBreakdown: [{ regionalOfficeId: 1, quantity: 10 }],
    })
    expect((result.body as { usageTrend: Array<{ month: string }> }).usageTrend.map(({ month }) => month))
      .toEqual(['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'])
  })

  it('rejects invalid date ranges', async () => {
    const { res, result } = response()
    await getDashboardHandler(service)(
      { query: { startDate: '2026-08-31', endDate: '2026-08-01' } } as unknown as Request,
      res,
      jest.fn() as NextFunction,
    )

    expect(result).toMatchObject({ statusCode: 400, body: { message: 'startDate must be on or before endDate.' } })
  })
})
