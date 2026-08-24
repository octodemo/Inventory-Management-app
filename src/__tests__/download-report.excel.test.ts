import { Request, Response } from 'express'
import {
  downloadReport,
  defaultReportData,
} from '../routes/downloadRoutes'
import {
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

describe('GET /api/download/report?format=excel', () => {
  it('returns excel file with appropriate headers', () => {
    const req = { query: { format: 'excel' } } as unknown as Request
    const res = createMockResponse()

    downloadReport(req, res)

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="usage-report.xlsx"',
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(expect.any(Buffer))
  })

  it('includes all report data with formatted headers and column widths', () => {
    const excelXml = generateExcelReportXml(defaultReportData)

    excelHeaders.forEach((header) => {
      expect(excelXml).toContain(`>${header}<`)
    })

    defaultReportData.forEach((row) => {
      expect(excelXml).toContain(`>${row.branchName}<`)
      expect(excelXml).toContain(`>${row.regionalOffice}<`)
      expect(excelXml).toContain(`>${row.itemName}<`)
      expect(excelXml).toContain(`>${row.vendorName}<`)
      expect(excelXml).toContain(`>${row.quantity}<`)
      expect(excelXml).toContain(`>${row.usageDate}<`)
    })

    expect(excelXml).toContain('<Style ss:ID="header">')
    expect(excelXml).toContain('<Font ss:Bold="1"/>')

    excelColumnWidths.forEach((width) => {
      expect(excelXml).toContain(`<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`)
    })
  })
})
