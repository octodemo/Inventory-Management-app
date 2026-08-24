import { Router } from 'express'
import { downloadReportPdf } from '../services/downloadReportPdf'

const downloadRoutes = Router()

downloadRoutes.post('/report-pdf', downloadReportPdf)

export default downloadRoutes
