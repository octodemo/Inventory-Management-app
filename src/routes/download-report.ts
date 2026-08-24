import type { Request, Response } from 'express'

export type ReportRow = Record<string, string | number | null | undefined>

export type ReportFilters = Record<string, unknown>

export interface ReportDataSource {
  fetchReportData: (filters: ReportFilters) => Promise<ReportRow[]>
}

const csvEscape = (value: string): string => {
  const formulaPrefixPattern = /^(\s*)([=+\-@|%])/
  const formulaPrefixed = formulaPrefixPattern.test(value)
  const sanitizedValue = value.replace(formulaPrefixPattern, "$1'$2")

  if (
    formulaPrefixed ||
    sanitizedValue.includes('"') ||
    sanitizedValue.includes(',') ||
    sanitizedValue.includes('\n') ||
    sanitizedValue.includes('\r') ||
    sanitizedValue.includes('\t')
  ) {
    return `"${sanitizedValue.replace(/"/g, '""')}"`
  }

  return sanitizedValue
}

export const buildCsv = (rows: ReportRow[]): string => {
  if (!rows.length) {
    return ''
  }

  const columns = Object.keys(rows[0])
  const header = columns.map((column) => csvEscape(column)).join(',')
  const data = rows.map((row) =>
    columns.map((column) => csvEscape(String(row[column] ?? ''))).join(','),
  )

  return [header, ...data].join('\n')
}

export const createCsvDownloadHandler =
  (reportDataSource: ReportDataSource) =>
  async (req: Request, res: Response): Promise<void> => {
    const { format, page: _page, limit: _limit, ...filters } = req.query

    if (format !== 'csv') {
      res.status(400).json({ message: 'Invalid format. Expected: csv' })
      return
    }

    const reportRows = await reportDataSource.fetchReportData(filters)
    const csv = buildCsv(reportRows)

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="report.csv"')
    res.status(200).send(csv)
  }
