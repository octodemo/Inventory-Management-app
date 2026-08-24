import { Router } from 'express'
import {
  uploadMiddleware,
  bulkUploadHandler,
  confirmUploadHandler,
  uploadTemplateHandler,
  exportCsvHandler,
  exportExcelHandler,
  exportPdfHandler,
} from '../services/uploadExportService'

const uploadExportRouter = Router()

uploadExportRouter.post('/upload/bulk', uploadMiddleware.single('file'), bulkUploadHandler)
uploadExportRouter.post('/upload/confirm', confirmUploadHandler)
uploadExportRouter.get('/upload/template', uploadTemplateHandler)

uploadExportRouter.get('/export/csv', exportCsvHandler)
uploadExportRouter.get('/export/excel', exportExcelHandler)
uploadExportRouter.get('/export/pdf', exportPdfHandler)

export default uploadExportRouter
