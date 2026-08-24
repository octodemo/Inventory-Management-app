import { Router } from 'express'
import { authenticate } from '../middleware/auth'
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

uploadExportRouter.post('/upload/bulk', authenticate, uploadMiddleware.single('file'), bulkUploadHandler)
uploadExportRouter.post('/upload/confirm', authenticate, confirmUploadHandler)
uploadExportRouter.get('/upload/template', authenticate, uploadTemplateHandler)

uploadExportRouter.get('/export/csv', authenticate, exportCsvHandler)
uploadExportRouter.get('/export/excel', authenticate, exportExcelHandler)
uploadExportRouter.get('/export/pdf', authenticate, exportPdfHandler)

export default uploadExportRouter
