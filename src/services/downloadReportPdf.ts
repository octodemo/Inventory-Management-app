import { Request, Response } from 'express'

type ReportFilterValue = string | number | boolean

interface ReportRow {
  [key: string]: ReportFilterValue
}

interface ReportPdfRequestBody {
  reportTitle: string
  filters: Record<string, ReportFilterValue>
  rows: ReportRow[]
}

export const buildReportPdfContent = (body: ReportPdfRequestBody, generatedAt: Date): string => {
  const filterSummary = Object.entries(body.filters)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const headers = body.rows.length > 0 ? Object.keys(body.rows[0]) : []
  const tableHeader = headers.join(' | ')
  const tableRows = body.rows.map((row) => headers.map((header) => row[header]).join(' | ')).join('\n')

  return [
    body.reportTitle,
    '',
    'Filter Summary',
    filterSummary,
    '',
    'Data Table',
    tableHeader,
    tableRows,
    '',
    `Generated At: ${generatedAt.toISOString()}`,
  ].join('\n')
}

export const downloadReportPdf = (req: Request, res: Response): void => {
  const body = req.body as ReportPdfRequestBody
  const generatedAt = new Date()
  const content = buildReportPdfContent(body, generatedAt)
  const pdfPayload = `%PDF-1.4\n${content}\n%%EOF`
  const pdfBuffer = Buffer.from(pdfPayload, 'utf-8')

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"')
  res.status(200).send(pdfBuffer)
}
