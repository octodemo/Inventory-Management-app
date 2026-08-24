import { Request, Response } from 'express'
import { createDownloadReportHandler } from '../routes/downloadRoutes'
import {
  ReportRow,
  excelColumnWidths,
  excelHeaders,
  generateExcelReportXml,
} from '../services/reportExportService'

type MockResponse = Response & {
  headers: Record<string, string>
}

const createMockResponse = (): MockResponse => {
  const headers: Record<string, string> = {}

  const response = {
    headers,
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn((name: string, value: string) => {
      headers[name] = value
      return response
    }),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }

  return response as unknown as MockResponse
}

const reportRows: ReportRow[] = [
  {
    branchName: 'Branch 1',
    regionalOffice: 'North Region',
    itemName: 'A4 Paper',
    vendorName: 'Vendor A',
    quantity: 120,
    usageDate: '2026-08-01T12:00:00Z',
  },
  {
    branchName: 'Branch 2',
    regionalOffice: 'South Region',
    itemName: 'Pen',
    vendorName: 'Vendor B',
    quantity: 75,
    usageDate: '2026-08-05',
  },
]

describe('GET /api/download/report?format=excel', () => {
  it('returns excel file with appropriate headers', () => {
    const req = { query: { format: 'excel' } } as unknown as Request
    const res = createMockResponse()

    const handler = createDownloadReportHandler(() => reportRows)
    handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/vnd.ms-excel')
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="usage-report.xls"',
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(expect.any(Buffer))
  })

  it('returns 400 for unsupported format', () => {
    const req = { query: { format: 'csv' } } as unknown as Request
    const res = createMockResponse()

    createDownloadReportHandler()(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid format. Supported format: excel',
        status: 400,
        timestamp: expect.any(String),
      }),
    )
  })

  it('includes all report data with formatted headers and column widths', () => {
    const excelXml = generateExcelReportXml(reportRows)

    excelHeaders.forEach((header) => {
      expect(excelXml).toContain(`>${header}<`)
    })

    reportRows.forEach((row) => {
      expect(excelXml).toContain(`>${row.branchName}<`)
      expect(excelXml).toContain(`>${row.regionalOffice}<`)
      expect(excelXml).toContain(`>${row.itemName}<`)
      expect(excelXml).toContain(`>${row.vendorName}<`)
      expect(excelXml).toContain(`<Data ss:Type="Number">${row.quantity}</Data>`)
    })

    expect(excelXml).toContain('>2026-08-01<')
    expect(excelXml).toContain('>2026-08-05<')

    expect(excelXml).toContain('<Style ss:ID="header">')
    expect(excelXml).toContain('<Font ss:Bold="1"/>')

    excelColumnWidths.forEach((width) => {
      expect(excelXml).toContain(`<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`)
    })
  })

  it('preserves and escapes invalid date values in export output', () => {
    const excelXml = generateExcelReportXml([
      {
        branchName: 'Branch X',
        regionalOffice: 'East',
        itemName: 'Marker',
        vendorName: 'Vendor C',
        quantity: 1,
        usageDate: 'invalid-date<&>',
      },
    ])

    expect(excelXml).toContain('>invalid-date&lt;&amp;&gt;<')
  })
})
