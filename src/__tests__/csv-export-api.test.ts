import { buildCsv, createCsvDownloadHandler, type ReportRow } from '../routes/download-report'

describe('GET /api/download/report (format=csv)', () => {
  let reportDataSource: {
    fetchReportData: jest.Mock<Promise<ReportRow[]>, [Record<string, unknown>]>
  }

  beforeEach(() => {
    jest.clearAllMocks()
    reportDataSource = {
      fetchReportData: jest.fn<Promise<ReportRow[]>, [Record<string, unknown>]>(),
    }
  })

  it('returns CSV file response with expected content headers', async () => {
    reportDataSource.fetchReportData.mockResolvedValue([
      { itemName: 'Pen', quantity: 12, branchName: 'Branch A' },
    ])

    const handler = createCsvDownloadHandler(reportDataSource)
    const req = { query: { format: 'csv', branchId: '1' } } as any
    const res = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn(),
      json: jest.fn(),
    } as any

    await handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8')
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="report.csv"',
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith('itemName,quantity,branchName\nPen,12,Branch A')
  })

  it('exports all filtered report rows without pagination constraints', async () => {
    reportDataSource.fetchReportData.mockResolvedValue([
      { itemName: 'Pen', quantity: 12, branchName: 'Branch A' },
      { itemName: 'Notebook', quantity: 8, branchName: 'Branch A' },
    ])

    const handler = createCsvDownloadHandler(reportDataSource)
    const req = {
      query: {
        format: 'csv',
        branchId: '1',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        page: '2',
        limit: '1',
      },
    } as any
    const res = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn(),
      json: jest.fn(),
    } as any

    await handler(req, res)

    expect(reportDataSource.fetchReportData).toHaveBeenCalledWith({
      branchId: '1',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(
      'itemName,quantity,branchName\nPen,12,Branch A\nNotebook,8,Branch A',
    )
  })

  it('returns 400 when format is not csv', async () => {
    const handler = createCsvDownloadHandler(reportDataSource)
    const req = { query: { format: 'excel' } } as any
    const res = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn(),
      json: jest.fn(),
    } as any

    await handler(req, res)

    expect(reportDataSource.fetchReportData).not.toHaveBeenCalled()
    expect(res.setHeader).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid format. Expected: csv' })
    expect(res.send).not.toHaveBeenCalled()
  })
})

describe('buildCsv', () => {
  it('returns empty string when no rows are provided', () => {
    expect(buildCsv([])).toBe('')
  })

  it('escapes commas, quotes, and newlines in headers and values', () => {
    const csv = buildCsv([
      {
        'item,name': 'A4 "Paper"',
        notes: 'line1\nline2',
      },
    ])

    expect(csv).toBe('"item,name",notes\n"A4 ""Paper""","line1\nline2"')
  })

  it('normalizes nullish values and protects spreadsheet formula injection', () => {
    const csv = buildCsv([
      {
        itemName: '=HYPERLINK("http://example.com")',
        quantity: null,
        remarks: undefined,
      },
    ])

    expect(csv).toBe('itemName,quantity,remarks\n"\'=HYPERLINK(""http://example.com"")",,')
  })
})
