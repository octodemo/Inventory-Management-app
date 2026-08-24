import { Request, Response } from 'express'
import downloadRoutes from '../routes/downloadRoutes'
import { downloadReportPdf } from '../services/downloadReportPdf'

const createMockResponse = () => {
  const setHeader = jest.fn()
  const status = jest.fn().mockReturnThis()
  const send = jest.fn().mockReturnThis()

  return {
    setHeader,
    status,
    send,
  } as unknown as Response
}

describe('POST /api/download/report-pdf', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-24T12:34:56.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('registers POST /report-pdf route', () => {
    const hasRoute = (downloadRoutes as unknown as { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> }).stack
      .some((layer) => layer.route?.path === '/report-pdf' && layer.route.methods.post)

    expect(hasRoute).toBe(true)
  })

  it('generates a PDF file from report data with proper formatting', () => {

    const req = {
      body: {
        reportTitle: 'Inventory Usage Report',
        filters: {
          branch: 'Branch 1',
          dateRange: '2026-08-01 to 2026-08-24',
        },
        rows: [
          { item: 'Blue Pen', quantity: 500, vendor: 'Vendor A' },
          { item: 'A4 Paper', quantity: 50, vendor: 'Vendor B' },
        ],
      },
    } as Request
    const res = createMockResponse()

    downloadReportPdf(req, res)

    expect((res.setHeader as jest.Mock).mock.calls).toEqual(
      expect.arrayContaining([
        ['Content-Type', 'application/pdf'],
        ['Content-Disposition', 'attachment; filename="report.pdf"'],
      ]),
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledTimes(1)

    const pdfOutput = (res.send as jest.Mock).mock.calls[0][0] as Buffer
    expect(pdfOutput.toString('utf-8')).toContain('%PDF-1.4')
  })

  it('includes report title, filter summary, data table, and timestamp in PDF output', () => {
    const req = {
      body: {
        reportTitle: 'Vendor Usage Summary',
        filters: {
          regionalOffice: 'RO-01',
          itemCategory: 'Writing Supplies',
        },
        rows: [
          { vendor: 'Vendor A', totalQuantity: 5000 },
        ],
      },
    } as Request
    const res = createMockResponse()

    downloadReportPdf(req, res)

    const pdfOutput = ((res.send as jest.Mock).mock.calls[0][0] as Buffer).toString('utf-8')

    expect(pdfOutput).toContain('Vendor Usage Summary')
    expect(pdfOutput).toContain('Filter Summary')
    expect(pdfOutput).toContain('regionalOffice: RO-01')
    expect(pdfOutput).toContain('itemCategory: Writing Supplies')
    expect(pdfOutput).toContain('Data Table')
    expect(pdfOutput).toContain('vendor | totalQuantity')
    expect(pdfOutput).toContain('Vendor A | 5000')
    expect(pdfOutput).toContain('Generated At: 2026-08-24T12:34:56.000Z')
  })
})
