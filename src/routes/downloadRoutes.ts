import { Router, Request, Response } from 'express'
import { ReportRow, generateExcelReportBuffer } from '../services/reportExportService'

const defaultReportData: ReadonlyArray<ReportRow> = [
  {
    branchName: 'Branch 1',
    regionalOffice: 'North Region',
    itemName: 'A4 Paper',
    vendorName: 'Vendor A',
    quantity: 120,
    usageDate: '2026-08-01',
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

export const getReportData = (): ReportRow[] => [...defaultReportData]

export const downloadReport = (req: Request, res: Response): void => {
  const { format } = req.query

  if (format !== 'excel') {
    res.status(400).json({
      message: 'Invalid format. Supported format: excel',
      status: 400,
      timestamp: new Date().toISOString(),
    })
    return
  }

  const reportData = getReportData()
  const excelBuffer = generateExcelReportBuffer(reportData)

  res.setHeader('Content-Type', 'application/vnd.ms-excel')
  res.setHeader('Content-Disposition', 'attachment; filename="usage-report.xls"')
  res.status(200).send(excelBuffer)
}

export const downloadRouter = Router()

downloadRouter.get('/report', downloadReport)
