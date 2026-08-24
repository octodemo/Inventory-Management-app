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

const escapePdfText = (value: string): string => value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')

const createPdfDocument = (content: string): Buffer => {
  const textCommands = content
    .split('\n')
    .map((line, index) => {
      const movement = index === 0 ? '50 780 Td' : '0 -16 Td'
      return `${movement}\n(${escapePdfText(line)}) Tj`
    })
    .join('\n')
  const stream = `BT\n/F1 12 Tf\n${textCommands}\nET`
  const streamObject = `<< /Length ${Buffer.byteLength(stream, 'utf-8')} >>\nstream\n${stream}\nendstream`

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    streamObject,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const objectOffsets: number[] = [0]

  objects.forEach((object, index) => {
    objectOffsets.push(Buffer.byteLength(pdf, 'utf-8'))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefOffset = Buffer.byteLength(pdf, 'utf-8')
  const xrefEntries = objectOffsets
    .map((offset, index) => (index === 0 ? '0000000000 65535 f ' : `${offset.toString().padStart(10, '0')} 00000 n `))
    .join('\n')

  pdf += `xref\n0 ${objects.length + 1}\n${xrefEntries}\n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += `startxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, 'utf-8')
}

export const downloadReportPdf = (req: Request, res: Response): void => {
  const body = req.body as ReportPdfRequestBody
  const generatedAt = new Date()
  const content = buildReportPdfContent(body, generatedAt)
  const pdfBuffer = createPdfDocument(content)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"')
  res.status(200).send(pdfBuffer)
}
