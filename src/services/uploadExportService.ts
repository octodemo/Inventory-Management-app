import { randomUUID } from 'node:crypto'
import { Buffer as NodeBuffer } from 'node:buffer'
import type { Request, Response } from 'express'
import multer from 'multer'
import Papa from 'papaparse'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
import type { Prisma } from '@prisma/client'
import { prisma } from './prisma'

const ALLOWED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

type RawUploadRow = Record<string, string>

type ParsedRow = {
  rowNumber: number
  data: RawUploadRow
  errors: string[]
}

type ValidUsageRow = {
  itemName: string
  branchName: string
  quantity: number
  usageDate: Date
  notes?: string
}

type StoredPreview = {
  validRows: ValidUsageRow[]
  totalRows: number
  invalidRows: number
  createdAt: number
}

const PREVIEW_TTL_MS = 15 * 60 * 1000

export interface UploadExportDependencies {
  usageRecordRepository: {
    createMany: (args: { data: ValidUsageRow[] }) => Promise<{ count: number }>
    findMany: (args: {
      where?: Prisma.UsageRecordWhereInput
      orderBy?: Prisma.UsageRecordOrderByWithRelationInput
    }) => Promise<
      Array<{
        itemName: string
        branchName: string
        quantity: number
        usageDate: Date
        notes: string | null
      }>
    >
  }
  previewStore: Map<string, StoredPreview>
  idGenerator: () => string
}

const defaultDependencies: UploadExportDependencies = {
  usageRecordRepository: prisma.usageRecord,
  previewStore: new Map<string, StoredPreview>(),
  idGenerator: () => randomUUID(),
}

function getFileExtension(fileName: string): string {
  const split = fileName.toLowerCase().split('.')
  return split.length > 1 ? split[split.length - 1] : ''
}

function escapeCsvValue(value: string | number | null): string {
  if (value === null) {
    return ''
  }

  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

async function parseCsvRows(buffer: NodeBuffer): Promise<RawUploadRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawUploadRow>(buffer.toString('utf-8'), {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error: Error) => reject(error),
    })
  })
}

async function parseExcelRows(buffer: NodeBuffer): Promise<RawUploadRow[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer as any)

  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    return []
  }

  const headerRow = worksheet.getRow(1)
  const headerValues = (headerRow.values ?? []) as ExcelJS.CellValue[]
  const headers = headerValues
    .slice(1)
    .map((value: ExcelJS.CellValue) => String(value ?? '').trim())
    .filter((value: string) => value.length > 0)

  const rows: RawUploadRow[] = []
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }

    const rowData: RawUploadRow = {}
    headers.forEach((header: string, index: number) => {
      const value = row.getCell(index + 1).value
      if (value instanceof Date) {
        rowData[header] = value.toISOString()
        return
      }

      if (typeof value === 'object' && value && 'result' in value) {
        rowData[header] = String(value.result ?? '').trim()
        return
      }

      rowData[header] = String(value ?? '').trim()
    })

    const hasAnyValue = Object.values(rowData).some((value) => value.trim().length > 0)
    if (hasAnyValue) {
      rows.push(rowData)
    }
  })

  return rows
}

function normalizeHeader(row: RawUploadRow, target: string): string {
  const entry = Object.entries(row).find(([key]) => key.toLowerCase() === target.toLowerCase())
  return (entry?.[1] ?? '').trim()
}

function validateRows(rows: RawUploadRow[]): { parsedRows: ParsedRow[]; validRows: ValidUsageRow[] } {
  const parsedRows: ParsedRow[] = []
  const validRows: ValidUsageRow[] = []

  rows.forEach((row, index) => {
    const rowNumber = index + 2
    const errors: string[] = []

    const itemName = normalizeHeader(row, 'itemName')
    const branchName = normalizeHeader(row, 'branchName')
    const quantityValue = normalizeHeader(row, 'quantity')
    const usageDateValue = normalizeHeader(row, 'usageDate')
    const notes = normalizeHeader(row, 'notes')

    if (!itemName) {
      errors.push('itemName is required')
    }

    if (!branchName) {
      errors.push('branchName is required')
    }

    const quantity = Number(quantityValue)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push('quantity must be a positive number')
    }

    const usageDate = new Date(usageDateValue)
    if (!usageDateValue || Number.isNaN(usageDate.getTime())) {
      errors.push('usageDate must be a valid date')
    }

    parsedRows.push({ rowNumber, data: row, errors })

    if (errors.length === 0) {
      validRows.push({
        itemName,
        branchName,
        quantity,
        usageDate,
        ...(notes ? { notes } : {}),
      })
    }
  })

  return { parsedRows, validRows }
}

async function parseUploadedRows(file: Express.Multer.File): Promise<RawUploadRow[]> {
  const extension = getFileExtension(file.originalname)

  if (extension === 'csv') {
    return parseCsvRows(file.buffer)
  }

  if (extension === 'xls' || extension === 'xlsx') {
    return parseExcelRows(file.buffer)
  }

  throw new Error('Unsupported file extension')
}

function buildUsageFilters(query: Request['query']): Prisma.UsageRecordWhereInput {
  const where: Prisma.UsageRecordWhereInput = {}

  if (typeof query.itemName === 'string' && query.itemName.trim()) {
    where.itemName = { contains: query.itemName.trim() }
  }

  if (typeof query.branchName === 'string' && query.branchName.trim()) {
    where.branchName = { contains: query.branchName.trim() }
  }

  if (typeof query.startDate === 'string' || typeof query.endDate === 'string') {
    const usageDate: Prisma.DateTimeFilter = {}

    if (typeof query.startDate === 'string' && query.startDate.trim()) {
      const startDate = new Date(query.startDate)
      if (!Number.isNaN(startDate.getTime())) {
        usageDate.gte = startDate
      }
    }

    if (typeof query.endDate === 'string' && query.endDate.trim()) {
      const endDate = new Date(query.endDate)
      if (!Number.isNaN(endDate.getTime())) {
        usageDate.lte = endDate
      }
    }

    if (usageDate.gte || usageDate.lte) {
      where.usageDate = usageDate
    }
  }

  return where
}

function toCsv(rows: Awaited<ReturnType<UploadExportDependencies['usageRecordRepository']['findMany']>>): string {
  const header = ['itemName', 'branchName', 'quantity', 'usageDate', 'notes']
  const body = rows.map((row) =>
    [
      escapeCsvValue(row.itemName),
      escapeCsvValue(row.branchName),
      escapeCsvValue(row.quantity),
      escapeCsvValue(row.usageDate.toISOString()),
      escapeCsvValue(row.notes),
    ].join(','),
  )

  return [header.join(','), ...body].join('\n')
}

async function toExcel(rows: Awaited<ReturnType<UploadExportDependencies['usageRecordRepository']['findMany']>>): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('UsageData')

  worksheet.columns = [
    { header: 'itemName', key: 'itemName', width: 30 },
    { header: 'branchName', key: 'branchName', width: 30 },
    { header: 'quantity', key: 'quantity', width: 15 },
    { header: 'usageDate', key: 'usageDate', width: 25 },
    { header: 'notes', key: 'notes', width: 40 },
  ]

  rows.forEach((row) => {
    worksheet.addRow({
      itemName: row.itemName,
      branchName: row.branchName,
      quantity: row.quantity,
      usageDate: row.usageDate.toISOString(),
      notes: row.notes ?? '',
    })
  })

  const output = await workbook.xlsx.writeBuffer()
  return Buffer.from(output)
}

async function toPdf(rows: Awaited<ReturnType<UploadExportDependencies['usageRecordRepository']['findMany']>>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' })
    const buffers: Buffer[] = []

    doc.on('data', (chunk) => buffers.push(chunk as Buffer))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    doc.fontSize(16).text('Usage Data Report', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(10).text(`Generated at: ${new Date().toISOString()}`)
    doc.moveDown()

    const headers = ['Item', 'Branch', 'Quantity', 'Usage Date']
    doc.fontSize(11).text(headers.join(' | '))
    doc.moveDown(0.2)
    doc.text('-'.repeat(100))

    rows.forEach((row) => {
      doc.text(
        [
          row.itemName,
          row.branchName,
          String(row.quantity),
          row.usageDate.toISOString().slice(0, 10),
        ].join(' | '),
      )
    })

    doc.end()
  })
}

/**
 * Multer middleware for bulk upload endpoints.
 */
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only CSV and Excel files are allowed'))
      return
    }

    cb(null, true)
  },
})

/**
 * Creates API handlers for bulk upload preview/confirm/template and usage exports.
 */
export function createUploadExportHandlers(dependencies: UploadExportDependencies = defaultDependencies) {
  const removeExpiredPreviews = (): void => {
    const now = Date.now()
    dependencies.previewStore.forEach((preview, key) => {
      if (now - preview.createdAt > PREVIEW_TTL_MS) {
        dependencies.previewStore.delete(key)
      }
    })
  }

  const sendInternalServerError = (res: Response, message: string): void => {
    res.status(500).json({
      message,
      status: 500,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Handles bulk upload parsing and preview without committing rows.
   */
  const bulkUploadHandler = async (req: Request, res: Response): Promise<void> => {
    const file = req.file
    if (!file) {
      res.status(400).json({ message: 'File is required' })
      return
    }

    const uploadType = typeof req.body?.uploadType === 'string' ? req.body.uploadType : 'usage'
    if (uploadType !== 'usage') {
      res.status(400).json({ message: `Unsupported uploadType: ${uploadType}` })
      return
    }

    try {
      removeExpiredPreviews()
      const rows = await parseUploadedRows(file)
      const { parsedRows, validRows } = validateRows(rows)
      const previewId = dependencies.idGenerator()

      dependencies.previewStore.set(previewId, {
        validRows,
        totalRows: rows.length,
        invalidRows: parsedRows.filter((row) => row.errors.length > 0).length,
        createdAt: Date.now(),
      })

      res.status(200).json({
        previewId,
        totalRows: rows.length,
        validRows: validRows.length,
        invalidRows: parsedRows.length - validRows.length,
        rows: parsedRows.slice(0, 10),
      })
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Failed to parse upload file',
      })
    }
  }

  /**
   * Handles preview confirmation and commits validated rows to the database.
   */
  const confirmUploadHandler = async (req: Request, res: Response): Promise<void> => {
    const previewId = typeof req.body?.previewId === 'string' ? req.body.previewId : ''

    if (!previewId) {
      res.status(400).json({ message: 'previewId is required' })
      return
    }

    removeExpiredPreviews()
    const preview = dependencies.previewStore.get(previewId)
    if (!preview) {
      res.status(404).json({ message: 'Preview not found or expired' })
      return
    }

    try {
      const result = await dependencies.usageRecordRepository.createMany({ data: preview.validRows })
      dependencies.previewStore.delete(previewId)

      res.status(200).json({
        committed: result.count,
        totalRows: preview.totalRows,
        invalidRows: preview.invalidRows,
      })
    } catch (error) {
      sendInternalServerError(
        res,
        error instanceof Error ? error.message : 'Failed to commit preview rows',
      )
    }
  }

  /**
   * Handles upload template download in CSV or Excel format.
   */
  const uploadTemplateHandler = async (req: Request, res: Response): Promise<void> => {
    const format = typeof req.query.format === 'string' ? req.query.format : 'csv'
    const headers = ['itemName', 'branchName', 'quantity', 'usageDate', 'notes']

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Template')
      worksheet.addRow(headers)

      const output = await workbook.xlsx.writeBuffer()
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      res.setHeader('Content-Disposition', 'attachment; filename="bulk-upload-template.xlsx"')
      res.status(200).send(Buffer.from(output))
      return
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="bulk-upload-template.csv"')
    res.status(200).send(`${headers.join(',')}\n`)
  }

  /**
   * Handles usage data export in CSV format using usage filters.
   */
  const exportCsvHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const rows = await dependencies.usageRecordRepository.findMany({
        where: buildUsageFilters(req.query),
        orderBy: { usageDate: 'desc' },
      })

      const csvOutput = toCsv(rows)

      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', 'attachment; filename="usage-data.csv"')
      res.status(200).send(csvOutput)
    } catch (error) {
      sendInternalServerError(
        res,
        error instanceof Error ? error.message : 'Failed to export usage data as CSV',
      )
    }
  }

  /**
   * Handles usage data export in Excel (.xlsx) format using usage filters.
   */
  const exportExcelHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const rows = await dependencies.usageRecordRepository.findMany({
        where: buildUsageFilters(req.query),
        orderBy: { usageDate: 'desc' },
      })

      const output = await toExcel(rows)

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      res.setHeader('Content-Disposition', 'attachment; filename="usage-data.xlsx"')
      res.status(200).send(output)
    } catch (error) {
      sendInternalServerError(
        res,
        error instanceof Error ? error.message : 'Failed to export usage data as Excel',
      )
    }
  }

  /**
   * Handles usage data export in PDF format using usage filters.
   */
  const exportPdfHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const rows = await dependencies.usageRecordRepository.findMany({
        where: buildUsageFilters(req.query),
        orderBy: { usageDate: 'desc' },
      })

      const output = await toPdf(rows)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename="usage-data.pdf"')
      res.status(200).send(output)
    } catch (error) {
      sendInternalServerError(
        res,
        error instanceof Error ? error.message : 'Failed to export usage data as PDF',
      )
    }
  }

  return {
    bulkUploadHandler,
    confirmUploadHandler,
    uploadTemplateHandler,
    exportCsvHandler,
    exportExcelHandler,
    exportPdfHandler,
  }
}

const defaultHandlers = createUploadExportHandlers()

/**
 * API handler for POST /api/upload/bulk.
 */
export const bulkUploadHandler = defaultHandlers.bulkUploadHandler

/**
 * API handler for POST /api/upload/confirm.
 */
export const confirmUploadHandler = defaultHandlers.confirmUploadHandler

/**
 * API handler for GET /api/upload/template.
 */
export const uploadTemplateHandler = defaultHandlers.uploadTemplateHandler

/**
 * API handler for GET /api/export/csv.
 */
export const exportCsvHandler = defaultHandlers.exportCsvHandler

/**
 * API handler for GET /api/export/excel.
 */
export const exportExcelHandler = defaultHandlers.exportExcelHandler

/**
 * API handler for GET /api/export/pdf.
 */
export const exportPdfHandler = defaultHandlers.exportPdfHandler
