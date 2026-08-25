import { RequestHandler, Router } from 'express'
import {
  uploadMiddleware,
  bulkUploadHandler,
  confirmUploadHandler,
  uploadTemplateHandler,
  exportCsvHandler,
  exportExcelHandler,
  exportPdfHandler,
} from '../services/uploadExportService'

export interface UploadExportRouterDependencies {
  authenticate: RequestHandler
  authorizeAdmin: RequestHandler
}

export const createUploadExportRouter = ({
  authenticate,
  authorizeAdmin,
}: UploadExportRouterDependencies): Router => {
  const uploadExportRouter = Router()

  uploadExportRouter.post(
    '/upload/bulk',
    authenticate,
    authorizeAdmin,
    uploadMiddleware.single('file'),
    bulkUploadHandler,
  )
  uploadExportRouter.post('/upload/confirm', authenticate, authorizeAdmin, confirmUploadHandler)
  uploadExportRouter.get('/upload/template', authenticate, authorizeAdmin, uploadTemplateHandler)

  uploadExportRouter.get('/export/csv', authenticate, exportCsvHandler)
  uploadExportRouter.get('/export/excel', authenticate, exportExcelHandler)
  uploadExportRouter.get('/export/pdf', authenticate, exportPdfHandler)

  return uploadExportRouter
}
