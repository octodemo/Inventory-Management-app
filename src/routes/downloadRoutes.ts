import { Router, Request, Response } from 'express'
import { ReportRow, generateExcelReportBuffer } from '../services/reportExportService'

export type ReportDataProvider = () => ReportRow[]

const defaultReportDataProvider: ReportDataProvider = () => []

export const createDownloadReportHandler = (
  reportDataProvider: ReportDataProvider = defaultReportDataProvider,
) => {
  return (req: Request, res: Response): void => {
    const { format } = req.query

    if (format !== 'excel') {
      res.status(400).json({
        message: 'Invalid format. Supported format: excel',
        status: 400,
        timestamp: new Date().toISOString(),
      })
      return
    }

    const reportData = reportDataProvider()
    const excelBuffer = generateExcelReportBuffer(reportData)

    res.setHeader('Content-Type', 'application/vnd.ms-excel')
    res.setHeader('Content-Disposition', 'attachment; filename="usage-report.xls"')
    res.status(200).send(excelBuffer)
  }
}

export const downloadReport = createDownloadReportHandler()

export const downloadRouter = Router()

downloadRouter.get('/report', downloadReport)

