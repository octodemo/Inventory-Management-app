import { Request, Response, Router } from 'express'
import { UploadFile, UploadService, isSupportedUploadFile, isSupportedUploadType } from '../services/uploadService'

type UploadRequest = Request & {
  file?: UploadFile
}

const toBadRequest = (res: Response, message: string): Response => {
  return res.status(400).json({
    message,
    status: 400,
    timestamp: new Date().toISOString(),
  })
}

export const createUploadHandler = (uploadService: UploadService) => async (req: UploadRequest, res: Response): Promise<Response> => {
  const uploadType = req.params.type
  const uploadedFile = req.file

  if (!isSupportedUploadType(uploadType)) {
    return toBadRequest(res, `Upload type "${uploadType}" is not supported`)
  }

  if (!uploadedFile) {
    return toBadRequest(res, 'No file was provided')
  }

  if (!isSupportedUploadFile(uploadedFile)) {
    return toBadRequest(res, 'Only CSV or Excel files are allowed')
  }

  const result = await uploadService.importData(uploadType, uploadedFile)

  return res.status(200).json(result)
}

export const createUploadRouter = (uploadService: UploadService): Router => {
  const router = Router()

  router.post('/:type', createUploadHandler(uploadService))

  return router
}
